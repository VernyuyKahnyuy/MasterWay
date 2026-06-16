import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonsByRoom } from "../services/lessonService";
import { getRoom } from "../services/roomService";
import { enrollInRoom } from "../services/enrollmentService";
import { getCommentsByRoom, createComment } from "../services/commentService";
import { formatDate } from "../utils/dateFormatter";
import { getCurrentUserId } from "../utils/auth";
import { createUpdate, getRoomUpdates } from "../services/accountabilityService";

function RoomDetailPage() {
  const { id } = useParams();
  const currentUserId = getCurrentUserId();
  const [room, setRoom] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [updateContent, setUpdateContent] = useState("");
  const [postingUpdate, setPostingUpdate] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      console.log(`[RoomDetailPage] Loading room ${id}`);
      try {
        const roomData = await getRoom(id);
        setRoom(roomData);
        const [lessonData, commentData, updateData] = await Promise.all([
          getLessonsByRoom(id),
          getCommentsByRoom(id),
          getRoomUpdates(id),
        ]);
        setLessons(lessonData);
        setComments(commentData);
        setUpdates(updateData);
        console.log(`[RoomDetailPage] Loaded ${lessonData.length} lessons, ${commentData.length} comments, ${updateData.length} updates`);
      } catch (error) {
        console.error("[RoomDetailPage] Failed to load room data:", error);
      }
    };
    fetchRoom();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollInRoom(id);
      setEnrolled(true);
      console.log(`[RoomDetailPage] Enrolled in room ${id}`);
    } catch (error) {
      console.error("[RoomDetailPage] Enrollment failed:", error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      await createComment(id, commentText);
      const updatedComments = await getCommentsByRoom(id);
      setComments(updatedComments);
      setCommentText("");
    } catch (error) {
      console.error("[RoomDetailPage] Failed to post comment:", error);
    } finally {
      setPostingComment(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateContent.trim()) return;
    setPostingUpdate(true);
    console.log(`[RoomDetailPage] Posting accountability update for room ${id}`);
    try {
      await createUpdate({ room: id, content: updateContent });
      const refreshed = await getRoomUpdates(id);
      setUpdates(refreshed);
      setUpdateContent("");
      console.log(`[RoomDetailPage] Accountability update posted successfully`);
    } catch (error) {
      console.error("[RoomDetailPage] Failed to post update:", error);
    } finally {
      setPostingUpdate(false);
    }
  };

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back navigation */}
      <div className="px-6 pt-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-700 font-medium transition-colors"
        >
          ← Back to Rooms
        </Link>
      </div>

      {/* Cover */}
      {room.cover_image ? (
        <img
          src={room.cover_image}
          alt={room.title}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-violet-600 to-violet-800" />
      )}

      <div className="px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{room.title}</h1>
          {currentUserId === room.creator ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-2 rounded-lg">
                Owned by you
              </span>
              <Link
                to={`/expert/room/${id}`}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                Edit Room
              </Link>
            </div>
          ) : enrolled ? (
            <span className="shrink-0 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-lg">
              ✓ Enrolled
            </span>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
          )}
        </div>

        <p className="text-gray-500 mb-2">{room.description}</p>

        {currentUserId !== room.creator && (
          <Link
            to={`/messages/send/${room.creator}`}
            className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium mb-8"
          >
            ✉️ Message Expert
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Lessons{" "}
                <span className="text-gray-400 font-normal text-base">
                  ({lessons.length})
                </span>
              </h2>
              {currentUserId === room.creator && (
                <Link
                  to={`/expert/create-lesson?room=${id}`}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  + Add Lesson
                </Link>
              )}
            </div>

            {lessons.length === 0 ? (
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">📝</p>
                <p>No lessons available yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="group flex items-center bg-white border border-gray-100 rounded-xl hover:border-violet-200 hover:shadow-sm transition-all overflow-hidden"
                  >
                    <Link
                      to={`/lessons/${lesson.id}`}
                      className="flex items-center gap-4 flex-1 p-4"
                    >
                      <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 group-hover:text-violet-700 transition-colors">
                          {lesson.title}
                        </p>
                        {lesson.content && (
                          <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">
                            {lesson.content}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-300 group-hover:text-violet-400 transition-colors">
                        →
                      </span>
                    </Link>
                    {lesson.creator === currentUserId && (
                      <Link
                        to={`/expert/lesson/${lesson.id}/edit`}
                        className="shrink-0 mr-4 text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accountability Circle */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Accountability Circle
            </h2>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-4">
              <form onSubmit={handleUpdateSubmit}>
                <textarea
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  placeholder="Share your learning progress..."
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
                />
                <button
                  type="submit"
                  disabled={postingUpdate || !updateContent.trim()}
                  className="mt-2 w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {postingUpdate ? "Posting..." : "Post Update"}
                </button>
              </form>
            </div>

            {updates.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No updates yet. Be the first to share your progress!
              </p>
            ) : (
              <div className="space-y-3">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="bg-white rounded-xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Link
                        to={`/profiles/${update.user}`}
                        className="text-sm font-semibold text-violet-700 hover:text-violet-800"
                      >
                        {update.username}
                      </Link>
                      <span className="text-xs text-gray-400">
                        {new Date(update.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{update.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discussion — full width below lessons and accountability */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Discussion
            </h2>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts or questions..."
                rows={3}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
              />
              <button
                onClick={handleComment}
                disabled={postingComment || !commentText.trim()}
                className="mt-2 w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {postingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>

            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No comments yet. Be the first!
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white rounded-xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Link
                        to={`/profiles/${comment.user}`}
                        className="text-sm font-semibold text-violet-700 hover:text-violet-800"
                      >
                        {comment.username}
                      </Link>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailPage;
