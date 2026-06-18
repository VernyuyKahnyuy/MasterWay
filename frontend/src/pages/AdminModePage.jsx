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

// ── Create tab ───────────────────────────────────────────────────────────────

function SectionBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3.5 py-1.5 font-bold rounded-lg transition-all"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        letterSpacing: "0.06em",
        background: active ? "rgba(0,200,255,0.18)" : "transparent",
        color: active ? "#00C8FF" : "rgba(0,200,255,0.45)",
        border: `1px solid ${active ? "rgba(0,200,255,0.45)" : "rgba(0,200,255,0.15)"}`,
      }}
    >
      {children}
    </button>
  );
}

function AdminField({ label, children }) {
  return (
    <div>
      <label className="block text-xs mb-1 tracking-widest"
        style={{ fontFamily: "'Space Mono', monospace", color: "rgba(0,200,255,0.55)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  background: "rgba(0,200,255,0.05)",
  border: "1px solid rgba(0,200,255,0.2)",
  color: "white",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
};

function SubmitBtn({ loading, done, error, label = "CREATE" }) {
  const bg = done ? "#22c55e" : error ? "#ef4444" : "#00C8FF";
  const text = loading ? "SUBMITTING…" : done ? "DONE ✓" : error ? "FAILED ✗" : label;
  return (
    <button
      type="submit"
      disabled={loading}
      className="font-bold px-5 py-2 rounded-lg text-sm disabled:opacity-40 transition-all"
      style={{ background: bg, color: "white", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}
    >
      {text}
    </button>
  );
}

function CreateUserForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "learner" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      await api.post("/users/register/", form);
      setStatus("done");
      setForm({ username: "", email: "", password: "", role: "learner" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const detail = err.response?.data;
      setMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <AdminField label="USERNAME">
        <input style={fieldStyle} value={form.username} onChange={set("username")} required placeholder="johndoe" />
      </AdminField>
      <AdminField label="EMAIL">
        <input style={fieldStyle} type="email" value={form.email} onChange={set("email")} required placeholder="john@example.com" />
      </AdminField>
      <AdminField label="PASSWORD">
        <input style={fieldStyle} type="password" value={form.password} onChange={set("password")} required placeholder="••••••••" />
      </AdminField>
      <AdminField label="ROLE">
        <select style={fieldStyle} value={form.role} onChange={set("role")}>
          <option value="learner">Learner</option>
          <option value="expert">Expert</option>
        </select>
      </AdminField>
      {msg && <p className="text-xs" style={{ color: "#ff6b6b" }}>{msg}</p>}
      <SubmitBtn loading={status === "loading"} done={status === "done"} error={status === "error"} label="CREATE USER" />
    </form>
  );
}

function CreateRoomForm() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [coverFile, setCoverFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (coverFile) fd.append("cover_image", coverFile);
      await api.post("/rooms/create/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus("done");
      setForm({ title: "", description: "" });
      setCoverFile(null);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const detail = err.response?.data;
      setMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <AdminField label="TITLE">
        <input style={fieldStyle} value={form.title} onChange={set("title")} required placeholder="Room title" />
      </AdminField>
      <AdminField label="DESCRIPTION">
        <textarea style={{ ...fieldStyle, resize: "none" }} rows={3} value={form.description} onChange={set("description")} placeholder="What is this room about?" />
      </AdminField>
      <AdminField label="COVER IMAGE (optional)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0] ?? null)}
          className="text-xs"
          style={{ color: "rgba(0,200,255,0.7)" }}
        />
      </AdminField>
      {msg && <p className="text-xs" style={{ color: "#ff6b6b" }}>{msg}</p>}
      <SubmitBtn loading={status === "loading"} done={status === "done"} error={status === "error"} label="CREATE ROOM" />
    </form>
  );
}

function CreateLessonForm({ rooms }) {
  const [form, setForm] = useState({ room: "", title: "", content: "", order: "1" });
  const [imgFile, setImgFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("room", form.room);
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("order", form.order);
      if (imgFile) fd.append("image", imgFile);
      await api.post("/lessons/create/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus("done");
      setForm({ room: "", title: "", content: "", order: "1" });
      setImgFile(null);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const detail = err.response?.data;
      setMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <AdminField label="ROOM">
        <select style={fieldStyle} value={form.room} onChange={set("room")} required>
          <option value="">— select room —</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>
      </AdminField>
      <AdminField label="TITLE">
        <input style={fieldStyle} value={form.title} onChange={set("title")} required placeholder="Lesson title" />
      </AdminField>
      <AdminField label="CONTENT">
        <textarea style={{ ...fieldStyle, resize: "vertical" }} rows={5} value={form.content} onChange={set("content")} required placeholder="Lesson content…" />
      </AdminField>
      <AdminField label="ORDER">
        <input style={fieldStyle} type="number" min={1} value={form.order} onChange={set("order")} />
      </AdminField>
      <AdminField label="THUMBNAIL (optional)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImgFile(e.target.files[0] ?? null)}
          className="text-xs"
          style={{ color: "rgba(0,200,255,0.7)" }}
        />
      </AdminField>
      {msg && <p className="text-xs" style={{ color: "#ff6b6b" }}>{msg}</p>}
      <SubmitBtn loading={status === "loading"} done={status === "done"} error={status === "error"} label="CREATE LESSON" />
    </form>
  );
}

function AddInterestForm({ users }) {
  const [userId, setUserId] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      await api.post(`/users/admin/interests/${userId}/`, { interest });
      setStatus("done");
      setInterest("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const detail = err.response?.data?.detail ?? err.response?.data;
      setMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <AdminField label="USER">
        <select style={fieldStyle} value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">— select user —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
          ))}
        </select>
      </AdminField>
      <AdminField label="INTEREST">
        <input style={fieldStyle} value={interest} onChange={(e) => setInterest(e.target.value)} required placeholder="e.g. machine learning" />
      </AdminField>
      {msg && <p className="text-xs" style={{ color: "#ff6b6b" }}>{msg}</p>}
      <SubmitBtn loading={status === "loading"} done={status === "done"} error={status === "error"} label="ADD INTEREST" />
    </form>
  );
}

function PostAsUserForm({ users, rooms }) {
  const [form, setForm] = useState({ userId: "", roomId: "", content: "", type: "comment" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      if (form.type === "comment") {
        await api.post("/community/admin/", { user_id: form.userId, room: form.roomId, text: form.content });
      } else {
        await api.post("/accountability/admin/", { user_id: form.userId, room: form.roomId, content: form.content });
      }
      setStatus("done");
      setForm((p) => ({ ...p, content: "" }));
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      const detail = err.response?.data?.detail ?? err.response?.data;
      setMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <AdminField label="POST TYPE">
        <div className="flex gap-2">
          {["comment", "update"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: t }))}
              className="text-xs px-3 py-1.5 rounded-lg font-bold"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.06em",
                background: form.type === t ? "#00C8FF" : "rgba(0,200,255,0.08)",
                color: form.type === t ? "white" : "rgba(0,200,255,0.6)",
                border: "1px solid rgba(0,200,255,0.25)",
              }}
            >
              {t === "comment" ? "💬 COMMENT" : "🔥 STUDY UPDATE"}
            </button>
          ))}
        </div>
      </AdminField>
      <AdminField label="AS USER">
        <select style={fieldStyle} value={form.userId} onChange={set("userId")} required>
          <option value="">— select user —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
      </AdminField>
      <AdminField label="IN ROOM">
        <select style={fieldStyle} value={form.roomId} onChange={set("roomId")} required>
          <option value="">— select room —</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>
      </AdminField>
      <AdminField label={form.type === "comment" ? "COMMENT TEXT" : "UPDATE CONTENT"}>
        <textarea
          style={{ ...fieldStyle, resize: "vertical" }}
          rows={4}
          value={form.content}
          onChange={set("content")}
          required
          placeholder={form.type === "comment" ? "Write a comment…" : "Share a study update…"}
        />
      </AdminField>
      {msg && <p className="text-xs" style={{ color: "#ff6b6b" }}>{msg}</p>}
      <SubmitBtn loading={status === "loading"} done={status === "done"} error={status === "error"} label={`POST ${form.type.toUpperCase()}`} />
    </form>
  );
}

function CreateTab() {
  const [section, setSection] = useState("user");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/profiles/admin/users/")
      .then((r) => setUsers(Array.isArray(r.data) ? r.data : (r.data?.results ?? [])))
      .catch(console.error);
    api.get("/rooms/")
      .then((r) => setRooms(Array.isArray(r.data) ? r.data : (r.data?.results ?? [])))
      .catch(console.error);
  }, []);

  const sections = [
    { id: "user", label: "👤 USER" },
    { id: "room", label: "🏠 ROOM" },
    { id: "lesson", label: "📝 LESSON" },
    { id: "interest", label: "⭐ INTEREST" },
    { id: "post", label: "💬 POST AS USER" },
  ];

  return (
    <>
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((s) => (
          <SectionBtn key={s.id} active={section === s.id} onClick={() => setSection(s.id)}>
            {s.label}
          </SectionBtn>
        ))}
      </div>

      {section === "user" && <CreateUserForm />}
      {section === "room" && <CreateRoomForm />}
      {section === "lesson" && <CreateLessonForm rooms={rooms} />}
      {section === "interest" && <AddInterestForm users={users} />}
      {section === "post" && <PostAsUserForm users={users} rooms={rooms} />}
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
          <TabBtn active={tab === "create"} onClick={() => setTab("create")}>⚡ CREATE</TabBtn>
        </div>

        {/* Panel */}
        <div className="rounded-xl p-6"
          style={{ background: "rgba(0,16,32,0.5)", border: "1px solid rgba(0,200,255,0.18)" }}>
          <p className="text-xs tracking-widest mb-5 uppercase"
            style={{ fontFamily: "'Space Mono', monospace", color: "rgba(0,200,255,0.5)" }}>
            // {tab === "rooms" ? "ALL ROOMS" : tab === "lessons" ? "ALL LESSONS" : tab === "users" ? "ALL USERS" : "RAPID CREATION"}
          </p>
          {tab === "rooms" && <RoomsTab />}
          {tab === "lessons" && <LessonsTab />}
          {tab === "users" && <UsersTab />}
          {tab === "create" && <CreateTab />}
        </div>
      </div>
    </div>
  );
}

export default AdminModePage;
