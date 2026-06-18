#!/usr/bin/env python3
"""Project-local MCP server for MasterWay.

This is a small stdio MCP server with no third-party dependencies. It exposes a
safe set of project commands to MCP clients.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
BACKEND_PYTHON = BACKEND / "venv" / "bin" / "python"
PROTOCOL_VERSION = "2024-11-05"


TOOLS: list[dict[str, Any]] = [
    {
        "name": "project_summary",
        "description": "Show the MasterWay project layout and common commands.",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": False,
        },
    },
    {
        "name": "run_backend_check",
        "description": "Run Django system checks with python manage.py check.",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": False,
        },
    },
    {
        "name": "run_backend_tests",
        "description": "Run Django tests with python manage.py test.",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": False,
        },
    },
    {
        "name": "run_frontend_lint",
        "description": "Run the frontend ESLint command.",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": False,
        },
    },
    {
        "name": "run_frontend_build",
        "description": "Build the Vite frontend.",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": False,
        },
    },
]


def respond(request_id: Any, result: Any = None, error: Any = None) -> None:
    response: dict[str, Any] = {"jsonrpc": "2.0", "id": request_id}
    if error is not None:
        response["error"] = error
    else:
        response["result"] = result
    sys.stdout.write(json.dumps(response) + "\n")
    sys.stdout.flush()


def text_content(text: str) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": text}]}


def run_command(command: list[str], cwd: Path, timeout: int = 120) -> str:
    if not cwd.exists():
        return f"Cannot run command because {cwd} does not exist."

    try:
        completed = subprocess.run(
            command,
            cwd=cwd,
            text=True,
            capture_output=True,
            timeout=timeout,
            check=False,
        )
    except FileNotFoundError as exc:
        return f"Command failed to start: {exc}"
    except subprocess.TimeoutExpired as exc:
        output = (exc.stdout or "") + (exc.stderr or "")
        return f"Command timed out after {timeout}s.\n{output}".strip()

    output = "\n".join(
        part
        for part in [
            f"$ {' '.join(command)}",
            f"exit code: {completed.returncode}",
            completed.stdout.strip(),
            completed.stderr.strip(),
        ]
        if part
    )
    return output


def project_summary() -> str:
    return "\n".join(
        [
            "MasterWay project MCP server",
            f"Root: {ROOT}",
            "",
            "Backend:",
            "- Django app in backend/",
            "- Check: python manage.py check",
            "- Tests: python manage.py test",
            "",
            "Frontend:",
            "- React/Vite app in frontend/",
            "- Lint: npm run lint",
            "- Build: npm run build",
        ]
    )


def call_tool(name: str) -> dict[str, Any]:
    backend_python = str(BACKEND_PYTHON if BACKEND_PYTHON.exists() else sys.executable)

    if name == "project_summary":
        return text_content(project_summary())
    if name == "run_backend_check":
        return text_content(run_command([backend_python, "manage.py", "check"], BACKEND))
    if name == "run_backend_tests":
        return text_content(run_command([backend_python, "manage.py", "test"], BACKEND))
    if name == "run_frontend_lint":
        return text_content(run_command(["npm", "run", "lint"], FRONTEND))
    if name == "run_frontend_build":
        return text_content(run_command(["npm", "run", "build"], FRONTEND))

    raise ValueError(f"Unknown tool: {name}")


def handle_message(message: dict[str, Any]) -> None:
    method = message.get("method")
    request_id = message.get("id")

    if method == "initialize":
        respond(
            request_id,
            {
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "masterway-project", "version": "0.1.0"},
            },
        )
        return

    if method == "notifications/initialized":
        return

    if method == "tools/list":
        respond(request_id, {"tools": TOOLS})
        return

    if method == "tools/call":
        params = message.get("params") or {}
        name = params.get("name")
        try:
            respond(request_id, call_tool(name))
        except Exception as exc:  # MCP should return errors as JSON-RPC payloads.
            respond(
                request_id,
                error={"code": -32602, "message": str(exc)},
            )
        return

    if request_id is not None:
        respond(
            request_id,
            error={"code": -32601, "message": f"Method not found: {method}"},
        )


def main() -> None:
    for line in sys.stdin:
        if not line.strip():
            continue
        try:
            handle_message(json.loads(line))
        except json.JSONDecodeError as exc:
            respond(None, error={"code": -32700, "message": f"Parse error: {exc}"})


if __name__ == "__main__":
    main()
