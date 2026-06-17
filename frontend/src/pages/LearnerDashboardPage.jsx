import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContinueLearning, getProgress } from "../services/progressService";
import { getSimilarLearners } from "../services/profileService";

function LearnerDashboardPage() {
  const [progress, setProgress] = useState([]);
  const [continueLearning, setContinueLearning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarLearners, setSimilarLearners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("[LearnerDashboard] Loading dashboard data");
      try {
        const [data, continueData, learners] = await Promise.all([
          getProgress(),
          getContinueLearning(),
          getSimilarLearners(),
        ]);
        setProgress(data);
        setContinueLearning(continueData);
        setSimilarLearners(learners);
        console.log(`[LearnerDashboard] Loaded: ${data.length} completed lessons, ${learners.length} similar learners`);
      } catch (error) {
        console.error("[LearnerDashboard] Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedLessons = progress.length;
  const totalLessons = 20;
  const percentage = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your learning progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-violet-600 text-white rounded-2xl p-5">
          <p className="text-3xl font-bold">{completedLessons}</p>
          <p className="text-violet-200 text-sm mt-1">Lessons Completed</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{percentage}%</p>
          <p className="text-gray-500 text-sm mt-1">Overall Progress</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{totalLessons}</p>
          <p className="text-gray-500 text-sm mt-1">Total Lessons</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">
            {totalLessons - completedLessons}
          </p>
          <p className="text-gray-500 text-sm mt-1">Remaining</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Learning Progress</h2>
          <span className="text-sm font-semibold text-violet-600">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-violet-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Continue Learning
          </h2>
          {continueLearning && continueLearning.lesson_id ? (
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide mb-1">
                Pick up where you left off
              </p>
              <p className="font-semibold text-gray-900 mb-1">
                {continueLearning.lesson_title}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Room: {continueLearning.room_title}
              </p>
              <Link
                to={`/lessons/${continueLearning.lesson_id}`}
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Resume →
              </Link>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
              <img src="/img-all-caught-up.png" alt="" className="w-28 h-28 mx-auto mb-3 object-contain" />
              <p className="font-medium text-gray-700">
                You are all caught up!
              </p>
              <Link
                to="/"
                className="inline-block mt-4 text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Browse more rooms →
              </Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            People With Similar Interests
          </h2>

          {similarLearners.length > 0 ? (
            <div className="space-y-3">
              {similarLearners.map((learner) => (
                <div
                  key={learner.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm flex items-center justify-center shrink-0">
                        {learner.username?.[0]?.toUpperCase() ?? "?"}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {learner.username}
                      </h4>
                    </div>
                    <Link
                      to={`/profiles/${learner.user}`}
                      className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                  {learner.interests && (
                    <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                      {learner.interests}
                    </p>
                  )}
                  {learner.shared_interests && (
                    <p className="text-xs text-violet-600 font-medium">
                      Shared: {learner.shared_interests}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
              <img src="/default-avatar.png" alt="" className="w-16 h-16 mx-auto mb-3 rounded-full opacity-50 object-cover" />
              <p className="text-gray-500 text-sm">No similar learners found yet.</p>
            </div>
          )}
        </div>

        {/* Completed Lessons */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Completed Lessons
          </h2>
          {progress.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
              <img src="/img-no-lessons.png" alt="" className="w-28 h-28 mx-auto mb-3 opacity-70 object-contain" />
              <p className="text-gray-500 text-sm">
                No lessons completed yet. Start learning!
              </p>
              <Link
                to="/"
                className="inline-block mt-4 text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Browse rooms →
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 shadow-sm overflow-hidden">
              {progress.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {item.lesson_title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearnerDashboardPage;
