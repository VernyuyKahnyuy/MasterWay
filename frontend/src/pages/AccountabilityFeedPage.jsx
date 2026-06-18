import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUpdates, getFeedEvents } from "../services/accountabilityService";
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

const EVENT_META = {
  user_joined:    { icon: "👋", color: "bg-emerald-100 text-emerald-600", label: "joined MasterWay" },
  room_created:   { icon: "🏠", color: "bg-violet-100 text-violet-600",  label: "created a room" },
  lesson_created: { icon: "📝", color: "bg-blue-100 text-blue-600",      label: "added a lesson" },
  comment_posted: { icon: "💬", color: "bg-amber-100 text-amber-600",    label: "commented in" },
  study_update:   { icon: "🔥", color: "bg-rose-100 text-rose-600",      label: "shared progress in" },
};

// Normalise both data shapes into one unified item format
function normaliseStudyUpdate(u) {
  return {
    _kind: 'study_update',
    id: `su-${u.id}`,
    event_type: 'study_update',
    actor_id: u.user,
    actor_username: u.username,
    profile_picture: u.profile_picture,
    room: u.room,
    room_title: u.room_title,
    lesson_title: '',
    message: u.content,
    created_at: u.created_at,
  };
}

function normaliseFeedEvent(e) {
  return {
    _kind: 'event',
    id: `ev-${e.id}`,
    event_type: e.event_type,
    actor_id: e.actor_id,
    actor_username: e.actor_username,
    profile_picture: e.profile_picture,
    room: e.room,
    room_title: e.room_title,
    lesson_title: e.lesson_title,
    message: e.message,
    created_at: e.created_at,
  };
}

function FeedCard({ item, currentUserId }) {
  const meta = EVENT_META[item.event_type] ?? EVENT_META.study_update;
  const isMe = String(item.actor_id) === String(currentUserId);

  return (
    <div
      className={`bg-white border rounded-2xl p-5 transition-shadow hover:shadow-sm ${
        isMe ? "border-violet-200 bg-violet-50/40" : "border-gray-100"
      }`}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 relative">
          <UserAvatar
            username={item.actor_username}
            profilePicture={item.profile_picture}
          />
          {/* Event type badge */}
          <span
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${meta.color}`}
            title={item.event_type.replace('_', ' ')}
          >
            {meta.icon}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {isMe ? (
              <span className="font-semibold text-violet-700 text-sm">(you)</span>
            ) : (
              <Link
                to={`/profiles/${item.actor_id}`}
                className="font-semibold text-gray-900 hover:text-violet-700 transition-colors text-sm"
              >
                {item.actor_username}
              </Link>
            )}

            <span className="text-xs text-gray-500">{meta.label}</span>

            {item.room_title && (
              <>
                {item.room ? (
                  <Link
                    to={`/rooms/${item.room}`}
                    className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors truncate max-w-[180px]"
                  >
                    {item.room_title}
                  </Link>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 truncate max-w-[180px]">
                    {item.room_title}
                  </span>
                )}
              </>
            )}

            {item.lesson_title && (
              <span className="text-xs text-gray-500 truncate max-w-[160px]">
                — "{item.lesson_title}"
              </span>
            )}

            <span className="text-gray-300 text-xs">•</span>
            <span className="text-xs text-gray-400">{timeAgo(item.created_at)}</span>
          </div>

          {/* Body text (study updates and comments) */}
          {item.message && (
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {item.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountabilityFeedPage() {
  const currentUserId = getCurrentUserId();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUpdates(), getFeedEvents()])
      .then(([updates, events]) => {
        const merged = [
          ...updates.map(normaliseStudyUpdate),
          ...events.map(normaliseFeedEvent),
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setItems(merged);
      })
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
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
        </div>
        <p className="text-gray-500 ml-[52px]">
          Everything happening on MasterWay — new members, rooms, lessons, progress.
        </p>

        {/* Legend */}
        <div className="ml-[52px] mt-3 flex flex-wrap gap-2">
          {Object.entries(EVENT_META).map(([type, { icon, color, label }]) => (
            <span
              key={type}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${color}`}
            >
              {icon} {label.replace(" in", "").replace(" MasterWay", " joined")}
            </span>
          ))}
        </div>
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
      ) : items.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium text-gray-500 text-lg">Nothing yet</p>
          <p className="text-sm mt-1">
            Activity will appear here as people join, create rooms, and share progress.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-5">
            {items.length} event{items.length !== 1 ? "s" : ""} from the community
          </p>
          <div className="space-y-4">
            {items.map((item) => (
              <FeedCard key={item.id} item={item} currentUserId={currentUserId} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AccountabilityFeedPage;
