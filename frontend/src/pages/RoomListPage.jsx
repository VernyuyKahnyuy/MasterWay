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
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Find your next learning room</h1>
        <p className="text-violet-200 mb-6">
          Explore expert-led rooms, follow lessons, and track your progress.
        </p>
        <div className="relative max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
          />
        </div>
      </div>

      {/* Room Grid */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Available Rooms{" "}
          <span className="text-gray-400 font-normal text-base">
            ({filtered.length})
          </span>
        </h2>
        <Link
          to="/recommendations"
          className="text-sm text-violet-600 hover:text-violet-700 font-medium"
        >
          View recommendations →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-2xl h-52 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-medium text-gray-500">No rooms found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => {
            const isOwner = room.creator === currentUserId;
            return (
              <div
                key={room.id}
                onClick={() => navigate(`/rooms/${room.id}`)}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-100 transition-all overflow-hidden cursor-pointer"
              >
                {isOwner && (
                  <span className="absolute top-2.5 left-2.5 z-10 bg-violet-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Owned by you
                  </span>
                )}
                {room.cover_image ? (
                  <img
                    src={room.cover_image}
                    alt={room.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-4xl">
                    📖
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors line-clamp-1">
                    {room.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {room.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      by{" "}
                      <span className="text-violet-600 font-medium">
                        {room.creator_username}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <Link
                          to={`/expert/room/${room.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
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
