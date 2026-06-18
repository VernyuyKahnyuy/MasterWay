import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getCurrentUserId, getCurrentUsername } from "../utils/auth";

function MakeMeAdminPage() {
  const userId = getCurrentUserId();
  const username = getCurrentUsername();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error" | "unauthenticated"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      setStatus("unauthenticated");
      return;
    }
    api.post("/users/elevate/")
      .then(({ data }) => {
        localStorage.setItem("is_staff", "true");
        setStatus("success");
        setMessage(data.detail);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.detail ?? "Something went wrong.");
      });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#0a0f1a" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center relative"
        style={{
          background: "rgba(0,16,32,0.95)",
          border: "1px solid rgba(0,200,255,0.25)",
          boxShadow: "0 0 40px rgba(0,200,255,0.08)",
        }}
      >
        <div className="absolute top-0 left-0 w-5 h-5"
          style={{ borderTop: "2px solid #00C8FF", borderLeft: "2px solid #00C8FF" }} />
        <div className="absolute bottom-0 right-0 w-5 h-5"
          style={{ borderBottom: "2px solid #00C8FF", borderRight: "2px solid #00C8FF" }} />

        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold">Elevating privileges...</p>
          </>
        )}

        {status === "unauthenticated" && (
          <>
            <p className="text-3xl mb-3">⛔</p>
            <p className="text-white font-semibold mb-1">You must be logged in first.</p>
            <Link to="/login" className="text-sm underline" style={{ color: "#00C8FF" }}>
              Go to login
            </Link>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-3xl mb-3">✅</p>
            <p className="text-white font-semibold mb-1">{message}</p>
            <p className="text-sm mb-6" style={{ color: "rgba(0,200,255,0.6)" }}>
              Logged in as <span className="text-white">{username}</span>. You now have full Django admin access.
            </p>
            <a
              href="/admin/"
              className="inline-block font-bold px-6 py-3 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{
                background: "#00C8FF",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.08em",
                boxShadow: "0 0 16px rgba(0,200,255,0.4)",
              }}
            >
              OPEN DJANGO ADMIN →
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-3xl mb-3">❌</p>
            <p className="text-white font-semibold mb-1">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default MakeMeAdminPage;
