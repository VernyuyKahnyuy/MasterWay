import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, updateRoom } from "../services/roomService";

function EditRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [existingCover, setExistingCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getRoom(id)
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setExistingCover(data.cover_image || null);
      })
      .catch(() => setError("Failed to load room."))
      .finally(() => setFetching(false));
  }, [id]);

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
      await updateRoom(id, formData);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate(`/rooms/${id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const previewSrc = coverImage
    ? URL.createObjectURL(coverImage)
    : existingCover || null;

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
        <p className="text-gray-500 mt-1">Update your room's details.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {saved && (
          <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 font-medium">
            ✓ Room updated — redirecting...
          </div>
        )}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Image{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Cover preview"
                className="w-full h-40 object-cover rounded-xl border border-gray-100 mb-3"
              />
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl px-5 py-4 text-sm font-medium text-gray-500 transition-colors justify-center">
              <span className="text-xl">🖼️</span>
              {coverImage ? coverImage.name : "Click to replace cover image"}
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
              onClick={() => navigate(`/rooms/${id}`)}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoomPage;
