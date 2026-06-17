import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendations } from "../services/recommendationService";

function RecommendationsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRooms(data.rooms || []);
      } catch (error) {
        setRooms([]);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recommended for you</h1>
        <p className="text-gray-500 mt-1">
          Personalized picks based on your interests
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-10 text-center">
          <img src="/img-discover.png" alt="" className="w-28 h-28 mx-auto mb-4 opacity-70 object-contain" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No recommendations yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Add your interests to your profile to get personalized room
            recommendations.
          </p>
          <Link
            to="/interests"
            className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Add Interests
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-100 transition-all overflow-hidden"
            >
              <img src="/default-room.jpg" alt="" className="w-full h-32 object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-900 line-clamp-1">
                    {room.title}
                  </h2>
                  <span className="shrink-0 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {room.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">
                    by{" "}
                    <span className="text-violet-600 font-medium">
                      {room.creator}
                    </span>
                  </span>
                  <Link
                    to={`/rooms/${room.id}`}
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Open →
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

export default RecommendationsPage;
