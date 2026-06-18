# MasterWay MCP Server

This folder contains a small dependency-free MCP server for this project.

## What It Provides

- `project_summary`: shows the project layout and common commands.
- `run_backend_check`: runs `python manage.py check` in `backend/`.
- `run_backend_tests`: runs `python manage.py test` in `backend/`.
- `run_frontend_lint`: runs `npm run lint` in `frontend/`.
- `run_frontend_build`: runs `npm run build` in `frontend/`.

The server only runs these allowlisted commands. It does not expose arbitrary shell access.

## Run It Manually

```bash
python3 mcp_server/server.py
```

MCP clients communicate with the server over stdio, so it will wait for JSON-RPC messages.

## Example Client Config

Use the absolute path to this repo on your machine:

```json
{
  "mcpServers": {
    "masterway-project": {
      "command": "python3",
      "args": [
        "/home/vernyuy/Documents/Code/final_year_project/mcp_server/server.py"
      ]
    }
  }
}
```

After adding it to your MCP client, restart the client and look for the `masterway-project` tools.
