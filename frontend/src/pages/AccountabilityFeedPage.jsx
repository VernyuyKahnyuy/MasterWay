import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUpdates } from "../services/accountabilityService";
import { getCurrentUserId } from "../utils/auth";
import UserAvatar from "../components/UserAvatar";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function AccountabilityFeedPage() {
  const currentUserId = getCurrentUserId();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUpdates()
      .then(setUpdates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl">
            🫂
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Accountability Feed
          </h1>
        </div>
        <p className="text-gray-500 ml-[52px]">
          See what everyone is learning. Stay motivated | Don't get left behind.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : updates.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium text-gray-500 text-lg">No updates yet</p>
          <p className="text-sm mt-1">
            Be the first to share your learning progress in any room.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-5">
            {updates.length} update{updates.length !== 1 ? "s" : ""} from the
            community
          </p>
          <div className="space-y-4">
            {updates.map((update) => {
              const isMe = update.user === currentUserId;
              return (
                <div
                  key={update.id}
                  className={`bg-white border rounded-2xl p-5 transition-shadow hover:shadow-sm ${
                    isMe
                      ? "border-violet-200 bg-violet-50/40"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex gap-4">
                    <UserAvatar
                      username={update.username}
                      profilePicture={update.profile_picture}
                    />
                    <div className="flex-1 min-w-0">
                      {/* Meta row */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link
                          to={`/profiles/${update.user}`}
                          className="font-semibold text-gray-900 hover:text-violet-700 transition-colors text-sm"
                        >
                          {update.username}
                        </Link>
                        {isMe && (
                          <span className="text-xs bg-violet-100 text-violet-600 font-semibold px-2 py-0.5 rounded-full">
                            you
                          </span>
                        )}
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-xs text-gray-400">
                          studying in
                        </span>
                        <Link
                          to={`/rooms/${update.room}`}
                          className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors truncate"
                        >
                          {update.room_title}
                        </Link>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-xs text-gray-400">
                          {timeAgo(update.created_at)}
                        </span>
                      </div>

                      {/* Update content */}
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {update.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default AccountabilityFeedPage;
