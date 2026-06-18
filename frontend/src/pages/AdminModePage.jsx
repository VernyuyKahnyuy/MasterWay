import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getAllLessons } from "../services/lessonService";
import UserAvatar from "../components/UserAvatar";

// ── Shared helpers ──────────────────────────────────────────────────────────

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 text-sm font-bold tracking-widest rounded-lg transition-all"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        background: active ? "#00C8FF" : "rgba(0,200,255,0.08)",
        color: active ? "white" : "rgba(0,200,255,0.7)",
        border: `1px solid ${active ? "#00C8FF" : "rgba(0,200,255,0.2)"}`,
        boxShadow: active ? "0 0 14px rgba(0,200,255,0.35)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-md mb-6 px-4 py-2.5 rounded-lg text-sm focus:outline-none"
      style={{
        background: "rgba(0,200,255,0.07)",
        border: "1px solid rgba(0,200,255,0.25)",
        color: "white",
      }}
    />
  );
}

function CountLabel({ n, label }) {
  return (
    <p className="text-xs mb-4" style={{ color: "rgba(0,200,255,0.5)", fontFamily: "'Space Mono', monospace" }}>
      {n} {label}{n !== 1 ? "s" : ""}
    </p>
  );
}

// Quick-upload button — opens a file picker and instantly PATCHes on selection.
// `onUpload(file) => Promise` should return the patched record.
function QuickImageBtn({ label, accept = "image/*", onUpload, small = false }) {
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const inputRef = useRef();

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("loading");
    try {
      await onUpload(file);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
    e.target.value = "";
  };

  const bg = status === "ok" ? "#22c55e" : status === "error" ? "#ef4444" : "rgba(0,200,255,0.12)";
  const text = status === "loading" ? "UPLOADING…" : status === "ok" ? "SAVED ✓" : status === "error" ? "FAILED ✗" : label;

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status === "loading"}
        className={`${small ? "text-xs px-2.5 py-1" : "text-xs px-3 py-1.5"} font-bold rounded-lg transition-all disabled:opacity-40`}
        style={{
          background: bg,
          color: status === "idle" ? "#00C8FF" : "white",
          border: "1px solid rgba(0,200,255,0.3)",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </>
  );
}

// ── Rooms tab ───────────────────────────────────────────────────────────────

function RoomsTab() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/rooms/")
      .then((r) => setRooms(Array.isArray(r.data) ? r.data : (r.data?.results ?? [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.creator_username ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const uploadCover = (roomId) => async (file) => {
    const fd = new FormData();
    fd.append("cover_image", file);
    const { data } = await api.patch(`/rooms/${roomId}/update/`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, cover_image: data.cover_image } : r)));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 rounded-xl animate-pulse" style={{ background: "rgba(0,200,255,0.06)" }} />
        ))}
      </div>
    );
  }

  return (
    <>
      <SearchInput value={search} onChange={setSearch} placeholder="Search rooms or creator…" />
      <CountLabel n={filtered.length} label="room" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room) => (
          <div key={room.id} className="rounded-xl overflow-hidden flex flex-col"
            style={{ background: "rgba(0,8,20,0.8)", border: "1px solid rgba(0,200,255,0.15)" }}>
            {room.cover_image ? (
              <img src={room.cover_image} alt={room.title} className="w-full h-28 object-cover" />
            ) : (
              <div className="w-full h-28 flex items-center justify-center text-2xl"
                style={{ background: "rgba(0,200,255,0.06)" }}>🏠</div>
            )}
            <div className="p-4 flex flex-col flex-1">
              <p className="font-bold text-white mb-0.5 line-clamp-1"
                style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>
                {room.title}
              </p>
              <p className="text-xs mb-3" style={{ color: "rgba(0,200,255,0.55)" }}>
                by {room.creator_username ?? "—"}
              </p>
              <div className="mt-auto flex gap-2 flex-wrap">
                <Link to={`/expert/rooms/${room.id}/edit`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: "#00C8FF", color: "white", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
                  EDIT
                </Link>
                <Link to={`/expert/create-lesson?room=${room.id}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(0,200,255,0.12)", color: "#00C8FF", border: "1px solid rgba(0,200,255,0.3)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
                  ADD LESSON
                </Link>
                <QuickImageBtn label="📷 COVER" onUpload={uploadCover(room.id)} />
                <Link to={`/rooms/${room.id}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
                  VIEW
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Lessons tab ─────────────────────────────────────────────────────────────

function LessonsTab() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllLessons()
      .then(setLessons)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()),
  );

  const uploadImage = (lessonId) => async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const { data } = await api.patch(`/lessons/${lessonId}/update/`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, image: data.image } : l)));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(0,200,255,0.06)" }} />
        ))}
      </div>
    );
  }

  return (
    <>
      <SearchInput value={search} onChange={setSearch} placeholder="Search lessons…" />
      <CountLabel n={filtered.length} label="lesson" />
      <div className="space-y-2">
        {filtered.map((lesson) => (
          <div key={lesson.id} className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "rgba(0,8,20,0.8)", border: "1px solid rgba(0,200,255,0.12)" }}>
            {/* thumbnail */}
            {lesson.image ? (
              <img src={lesson.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-base"
                style={{ background: "rgba(0,200,255,0.08)" }}>📝</div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white line-clamp-1">{lesson.title}</p>
              {lesson.room_title && (
                <p className="text-xs" style={{ color: "rgba(0,200,255,0.5)" }}>{lesson.room_title}</p>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              <QuickImageBtn label="📷 IMAGE" onUpload={uploadImage(lesson.id)} />
              <Link to={`/expert/lesson/${lesson.id}/edit`}
                className="text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ background: "#00C8FF", color: "white", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
                EDIT
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Users tab ───────────────────────────────────────────────────────────────

function StreakSetter({ userId, initialOverride }) {
  const [value, setValue] = useState(initialOverride ?? "");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error

  const handleSet = async () => {
    setStatus("loading");
    try {
      const streak_override = value === "" ? null : Number(value);
      await api.patch(`/profiles/admin/${userId}/`, { streak_override });
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: "rgba(0,200,255,0.6)", fontFamily: "'Space Mono', monospace" }}>🔥</span>
      <input
        type="number"
        min={0}
        max={9999}
        placeholder="streak"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-16 text-center text-xs rounded px-2 py-1 focus:outline-none"
        style={{ background: "rgba(0,200,255,0.07)", border: "1px solid rgba(0,200,255,0.2)", color: "white" }}
      />
      <button
        onClick={handleSet}
        disabled={status === "loading"}
        className="text-xs font-bold px-2.5 py-1 rounded-lg disabled:opacity-40"
        style={{
          background: status === "ok" ? "#22c55e" : status === "error" ? "#ef4444" : "rgba(0,200,255,0.12)",
          color: status === "idle" ? "#00C8FF" : "white",
          border: "1px solid rgba(0,200,255,0.25)",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.06em",
        }}
      >
        {status === "loading" ? "…" : status === "ok" ? "✓" : status === "error" ? "✗" : "SET"}
      </button>
    </div>
  );
}

function ProfileEditForm({ user, onSaved }) {
  const [bio, setBio] = useState(user.profile_bio ?? "");
  const [interests, setInterests] = useState(user.profile_interests ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.patch(`/profiles/admin/${user.id}/`, { bio, interests });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSaved(user.id, { bio, interests });
    } catch (e) {
      setError(e.response?.data?.detail ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 space-y-3 pl-2 border-l-2" style={{ borderColor: "rgba(0,200,255,0.3)" }}>
      <div>
        <label className="block text-xs mb-1 tracking-widest"
          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(0,200,255,0.6)" }}>BIO</label>
        <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
          style={{ background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "white" }} />
      </div>
      <div>
        <label className="block text-xs mb-1 tracking-widest"
          style={{ fontFamily: "'Space Mono', monospace", color: "rgba(0,200,255,0.6)" }}>INTERESTS</label>
        <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={{ background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.2)", color: "white" }} />
      </div>
      {error && <p className="text-xs" style={{ color: "#ff6b6b" }}>{error}</p>}
      <button onClick={handleSave} disabled={saving}
        className="text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-40"
        style={{
          background: saved ? "#22c55e" : "#00C8FF",
          color: "white",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.06em",
        }}>
        {saving ? "SAVING…" : saved ? "SAVED ✓" : "SAVE BIO & INTERESTS"}
      </button>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/profiles/admin/users/")
      .then((r) => setUsers(Array.isArray(r.data) ? r.data : (r.data?.results ?? [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaved = (userId, patch) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...patch } : u));
  };

  const uploadPicture = (userId) => async (file) => {
    const fd = new FormData();
    fd.append("profile_picture", file);
    const { data } = await api.patch(`/profiles/admin/${userId}/`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUsers((prev) => prev.map((u) =>
      u.id === userId ? { ...u, profile_picture: data.profile_picture } : u
    ));
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(0,200,255,0.06)" }} />
        ))}
      </div>
    );
  }

  return (
    <>
      <SearchInput value={search} onChange={setSearch} placeholder="Search by username or email…" />
      <CountLabel n={filtered.length} label="user" />
      <div className="space-y-3">
        {filtered.map((user) => {
          const isOpen = expanded === user.id;
          return (
            <div key={user.id} className="rounded-xl p-4"
              style={{ background: "rgba(0,8,20,0.8)", border: `1px solid ${isOpen ? "rgba(0,200,255,0.4)" : "rgba(0,200,255,0.12)"}` }}>
              {/* Top row */}
              <div className="flex items-center gap-3 flex-wrap">
                <UserAvatar username={user.username} profilePicture={user.profile_picture} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{user.username}</span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: user.is_staff ? "rgba(0,200,255,0.2)" : "rgba(255,255,255,0.06)",
                        color: user.is_staff ? "#00C8FF" : "rgba(255,255,255,0.4)",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.6rem",
                      }}>
                      {user.is_staff ? "ADMIN" : (user.role?.toUpperCase() ?? "USER")}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {/* Streak setter */}
                  <StreakSetter userId={user.id} initialOverride={user.streak_override} />

                  {/* Change picture */}
                  <QuickImageBtn
                    label="📷 PICTURE"
                    onUpload={uploadPicture(user.id)}
                  />

                  {/* Edit profile (bio/interests) */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : user.id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{
                      background: isOpen ? "rgba(0,200,255,0.2)" : "rgba(0,200,255,0.08)",
                      color: "#00C8FF",
                      border: "1px solid rgba(0,200,255,0.25)",
                      fontFamily: "'Rajdhani', sans-serif",
                      letterSpacing: "0.06em",
                    }}>
                    {isOpen ? "CLOSE" : "EDIT PROFILE"}
                  </button>
                </div>
              </div>

              {isOpen && <ProfileEditForm user={user} onSaved={handleSaved} />}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

function AdminModePage() {
  const [tab, setTab] = useState("rooms");

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: "#070d18" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="absolute top-0 left-0 w-5 h-5"
            style={{ borderTop: "2px solid #00C8FF", borderLeft: "2px solid #00C8FF" }} />
          <div className="pl-4 pt-1">
            <p className="text-xs tracking-widest mb-1 uppercase"
              style={{ fontFamily: "'Space Mono', monospace", color: "rgba(0,200,255,0.5)" }}>
              // SYSTEM :: ADMIN CONSOLE
            </p>
            <h1 className="text-3xl font-bold"
              style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", color: "#00C8FF", textShadow: "0 0 20px rgba(0,200,255,0.4)" }}>
              ADMIN MODE
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(0,200,255,0.5)" }}>
              Full control — rooms, lessons, and user profiles.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <TabBtn active={tab === "rooms"} onClick={() => setTab("rooms")}>🏠 ROOMS</TabBtn>
          <TabBtn active={tab === "lessons"} onClick={() => setTab("lessons")}>📝 LESSONS</TabBtn>
          <TabBtn active={tab === "users"} onClick={() => setTab("users")}>👥 USERS</TabBtn>
        </div>

        {/* Panel */}
        <div className="rounded-xl p-6"
          style={{ background: "rgba(0,16,32,0.5)", border: "1px solid rgba(0,200,255,0.18)" }}>
          <p className="text-xs tracking-widest mb-5 uppercase"
            style={{ fontFamily: "'Space Mono', monospace", color: "rgba(0,200,255,0.5)" }}>
            // {tab === "rooms" ? "ALL ROOMS" : tab === "lessons" ? "ALL LESSONS" : "ALL USERS"}
          </p>
          {tab === "rooms" && <RoomsTab />}
          {tab === "lessons" && <LessonsTab />}
          {tab === "users" && <UsersTab />}
        </div>
      </div>
    </div>
  );
}

export default AdminModePage;
