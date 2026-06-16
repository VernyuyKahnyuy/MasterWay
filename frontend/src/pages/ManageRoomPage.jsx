import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRoom } from "../services/roomService";
import { getLessonsByRoom, deleteLesson } from "../services/lessonService";

function ManageRoomPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomData = await getRoom(id);
        const lessonsData = await getLessonsByRoom(id);
        setRoom(roomData);
        setLessons(lessonsData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm("Delete this lesson?");
    if (!confirmed) return;
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch (error) {
      console.error(error);
    }
  };

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Room Header */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="flex items-start gap-5 p-6">
          {room.cover_image ? (
            <img
              src={room.cover_image}
              alt={room.title}
              className="w-32 h-24 object-cover rounded-xl shrink-0"
            />
          ) : (
            <div className="w-32 h-24 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center text-4xl shrink-0">
              📖
            </div>
          )}
          <div className="flex-1">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">
              Managing Room
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {room.title}
            </h1>
            <p className="text-gray-500 text-sm">{room.description}</p>
          </div>
          <Link
            to={`/rooms/${id}`}
            className="shrink-0 text-sm border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Preview Room →
          </Link>
        </div>
      </div>

      {/* Lessons */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Lessons{" "}
          <span className="text-gray-400 font-normal text-base">
            ({lessons.length})
          </span>
        </h2>
        <button
          onClick={() => navigate("/expert/create-lesson")}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Add Lesson
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3">📝</p>
          <p className="font-medium text-gray-700 mb-2">No lessons yet</p>
          <p className="text-sm text-gray-400 mb-5">
            Create your first lesson for this room.
          </p>
          <button
            onClick={() => navigate("/expert/create-lesson")}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Create First Lesson
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm flex items-center justify-center shrink-0">
                {lesson.order}
              </span>
              <p className="flex-1 font-medium text-gray-800">{lesson.title}</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    navigate(`/expert/lesson/${lesson.id}/edit`)
                  }
                  className="text-sm bg-violet-50 hover:bg-violet-100 text-violet-700 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageRoomPage;
