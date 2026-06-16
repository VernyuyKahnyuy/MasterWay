import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/roomService";

function CreateRoomPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (coverImage) {
        formData.append("cover_image", coverImage);
      }
      await createRoom(formData);
      navigate("/expert/rooms");
    } catch (error) {
      console.error(error);
      setError("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Room</h1>
        <p className="text-gray-500 mt-1">
          Set up a new learning room for your students.
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
              Room Title
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction to Python"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="What will students learn in this room?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Image{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {coverImage && (
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border border-gray-100 mb-3"
              />
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl px-5 py-4 text-sm font-medium text-gray-500 transition-colors justify-center">
              <span className="text-xl">🖼️</span>
              {coverImage ? coverImage.name : "Click to upload cover image"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="hidden"
              />
            </label>
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
              {loading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomPage;
