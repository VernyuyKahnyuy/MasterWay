import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMyRooms } from "../services/roomService";
import { createLesson } from "../services/lessonService";

function CreateLessonPage() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdf, setPdf] = useState(null);
  const [image, setImage] = useState(null);
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getMyRooms();
      setRooms(data);
      const preselected = searchParams.get("room");
      if (preselected) setRoom(preselected);
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("room", room);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("video_url", videoUrl);
      formData.append("order", order);
      if (pdf) formData.append("pdf", pdf);
      if (image) formData.append("image", image);
      await createLesson(formData);
      navigate("/expert/rooms");
    } catch (err) {
      console.error(err);
      setError("Failed to create lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Lesson</h1>
        <p className="text-gray-500 mt-1">
          Add a new lesson to one of your rooms.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Room
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lesson Title
            </label>
            <input
              type="text"
              placeholder="e.g. Variables and Data Types"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lesson Notes
            </label>
            <textarea
              placeholder="Write the lesson content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              YouTube Video URL{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lesson Order
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Supporting Image
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl px-4 py-4 text-xs text-gray-500 transition-colors">
                <span className="text-2xl">🖼️</span>
                {image ? (
                  <span className="text-violet-600 font-medium truncate max-w-full">
                    {image.name}
                  </span>
                ) : (
                  "Upload image"
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                PDF Notes
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl px-4 py-4 text-xs text-gray-500 transition-colors">
                <span className="text-2xl">📄</span>
                {pdf ? (
                  <span className="text-violet-600 font-medium truncate max-w-full">
                    {pdf.name}
                  </span>
                ) : (
                  "Upload PDF"
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/expert/rooms")}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLessonPage;
