import { useState, useEffect } from "react";
import {
  getInterests,
  createInterest,
  deleteInterest,
} from "../services/interestService";

function InterestsPage() {
  const [interest, setInterest] = useState("");
  const [interests, setInterests] = useState([]);
  const [adding, setAdding] = useState(false);

  const fetchInterests = async () => {
    try {
      const data = await getInterests();
      setInterests(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interest.trim()) return;
    setAdding(true);
    try {
      await createInterest(interest.trim());
      setInterest("");
      fetchInterests();
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInterest(id);
      fetchInterests();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Interests</h1>
        <p className="text-gray-500 mt-1">
          These help us recommend the best learning rooms for you.
        </p>
      </div>

      {/* Add Interest */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Add an interest
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="e.g. Python, Design, Finance..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={adding || !interest.trim()}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60 shrink-0"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* Interests List */}
      {interests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3">🎯</p>
          <p className="font-medium text-gray-700">No interests yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add some topics you&apos;d like to learn about.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Your interests ({interests.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-800 pl-4 pr-2 py-2 rounded-full"
              >
                <span className="text-sm font-medium">{item.interest}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-5 h-5 rounded-full bg-violet-200 hover:bg-red-100 hover:text-red-600 text-violet-600 flex items-center justify-center text-xs transition-colors font-bold"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InterestsPage;
