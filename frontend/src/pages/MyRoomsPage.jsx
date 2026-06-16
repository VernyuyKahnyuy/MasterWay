import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRooms } from "../services/roomService";

function MyRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getMyRooms();
        setRooms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Rooms</h1>
          <p className="text-gray-500 mt-1">Rooms you have created</p>
        </div>
        <Link
          to="/expert/create-room"
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          + New Room
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">🏫</p>
          <p className="font-medium text-gray-700 mb-2">
            No rooms created yet
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Create your first room and start teaching.
          </p>
          <Link
            to="/expert/create-room"
            className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Create Your First Room
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:border-violet-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-5 p-5">
                {room.cover_image ? (
                  <img
                    src={room.cover_image}
                    alt={room.title}
                    className="w-24 h-20 object-cover rounded-xl shrink-0"
                  />
                ) : (
                  <div className="w-24 h-20 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center text-3xl shrink-0">
                    📖
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {room.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {room.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    to={`/expert/room/${room.id}`}
                    className="text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    Manage
                  </Link>
                  <Link
                    to={`/rooms/${room.id}`}
                    className="text-sm font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRoomsPage;
