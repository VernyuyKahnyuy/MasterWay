import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms } from "../services/roomService";
import { getCurrentUserId } from "../utils/auth";

function RoomListPage() {
  const currentUserId = getCurrentUserId();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filtered = rooms.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-8">
      {/* ── Cyberpunk Hero ── */}
      <div
        className="cyber-hero cyber-corner relative rounded-xl p-8 mb-8 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(0,24,40,0.88) 0%, rgba(0,40,64,0.82) 45%, rgba(0,16,32,0.92) 100%), url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(0,200,255,0.30)",
          boxShadow: "0 0 40px rgba(0,200,255,0.12), inset 0 0 80px rgba(0,200,255,0.04)",
        }}
      >
        {/* corner bracket decorations (top-right and bottom-left) */}
        <div
          className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
          style={{ borderTop: "2px solid #00C8FF", borderRight: "2px solid #00C8FF" }}
        />
        <div
          className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none"
          style={{ borderBottom: "2px solid #00C8FF", borderLeft: "2px solid #00C8FF" }}
        />

        {/* label badge */}
        <p
          className="text-xs font-bold tracking-widest mb-3 uppercase"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: "rgba(0,200,255,0.6)",
          }}
        >
          // LEARNING NETWORK v2.0
        </p>

        <h1
          className="text-3xl md:text-4xl font-bold mb-2 leading-tight"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.04em",
            color: "#00C8FF",
            textShadow: "0 0 24px rgba(0,200,255,0.6), 0 0 48px rgba(0,200,255,0.2)",
          }}
        >
          FIND YOUR NEXT
          <br />
          <span style={{ color: "white" }}>LEARNING ROOM</span>
        </h1>

        <p
          className="mb-6 text-sm"
          style={{ color: "rgba(0,200,255,0.65)", fontFamily: "'Inter', sans-serif" }}
        >
          Explore expert-led rooms, follow lessons, and track your progress.
        </p>

        <div className="relative max-w-lg">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: "#00C8FF", fontFamily: "'Space Mono', monospace" }}
          >
            ›_
          </span>
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded text-sm focus:outline-none transition"
            style={{
              background: "rgba(0,200,255,0.07)",
              border: "1px solid rgba(0,200,255,0.30)",
              color: "white",
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      </div>

      {/* ── Grid header ── */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-xl font-semibold text-gray-900"
          style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}
        >
          AVAILABLE ROOMS{" "}
          <span
            className="font-normal text-base"
            style={{ fontFamily: "'Space Mono', monospace", color: "var(--cyber-text)", fontSize: "0.8rem" }}
          >
            [{filtered.length}]
          </span>
        </h2>
        <Link
          to="/recommendations"
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--cyber-text)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}
        >
          VIEW RECOMMENDATIONS →
        </Link>
      </div>

      {/* ── Rooms ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl h-52 animate-pulse"
              style={{ background: "rgba(0,200,255,0.07)" }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <img src="/img-discover.png" alt="" className="w-32 h-32 mx-auto mb-4 opacity-70 object-contain" />
          <p
            className="font-semibold text-gray-900"
            style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}
          >
            NO SIGNAL FOUND
          </p>
          <p className="text-sm mt-1 text-gray-500">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => {
            const isOwner = room.creator === currentUserId;
            return (
              <div
                key={room.id}
                onClick={() => navigate(`/rooms/${room.id}`)}
                className="cyber-card group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer"
              >
                {isOwner && (
                  <span
                    className="absolute top-2.5 left-2.5 z-10 text-white text-xs font-bold px-2.5 py-1 rounded"
                    style={{
                      background: "#00C8FF",
                      boxShadow: "0 0 8px rgba(0,200,255,0.5)",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    OWNED
                  </span>
                )}
                {room.cover_image ? (
                  <img
                    src={room.cover_image}
                    alt={room.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <img
                    src="/default-room.jpg"
                    alt=""
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3
                    className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1"
                    style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}
                  >
                    {room.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {room.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      by{" "}
                      <span
                        className="font-medium"
                        style={{ color: "var(--cyber-text)" }}
                      >
                        {room.creator_username}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <Link
                          to={`/expert/room/${room.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold px-3 py-1.5 rounded transition-colors"
                          style={{
                            background: "rgba(0,200,255,0.10)",
                            color: "var(--cyber-text)",
                            border: "1px solid rgba(0,200,255,0.30)",
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.65rem",
                          }}
                        >
                          EDIT
                        </Link>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(room.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoomListPage;
