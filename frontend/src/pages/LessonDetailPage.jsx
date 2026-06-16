import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson } from "../services/lessonService";
import { markLessonComplete } from "../services/progressService";
import { generateSummary, generateQuiz } from "../services/aiService";

function LessonDetailPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLesson(id);
        setLesson(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLesson();
  }, [id]);

  const handleComplete = async () => {
    setMarking(true);
    try {
      await markLessonComplete(id);
      setCompleted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setMarking(false);
    }
  };

  const handleSummary = async () => {
    setLoadingSummary(true);
    try {
      const data = await generateSummary(id);
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const data = await generateQuiz(id);
      setQuiz(data.quiz);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
        <div className="flex items-center gap-3">
          {completed ? (
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
              ✓ Completed
            </span>
          ) : (
            <button
              onClick={handleComplete}
              disabled={marking}
              className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-200 transition-colors disabled:opacity-60"
            >
              {marking ? "Marking..." : "✓ Mark Complete"}
            </button>
          )}
          <Link
            to={`/messages/send/${lesson.creator}`}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            ✉️ Message Expert
          </Link>
        </div>
      </div>

      {/* Lesson Image */}
      {lesson.image && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full max-h-80 object-cover"
          />
        </div>
      )}

      {/* Video */}
      {lesson.video_url && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm">
              ▶
            </span>
            Video Lesson
          </h2>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={getYoutubeEmbedUrl(lesson.video_url)}
              title="Lesson Video"
              allowFullScreen
              className="block"
            />
          </div>
        </div>
      )}

      {/* PDF */}
      {lesson.pdf && (
        <div className="mb-8 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">PDF Material</p>
              <p className="text-xs text-gray-500">Download and read offline</p>
            </div>
          </div>
          <a
            href={lesson.pdf}
            target="_blank"
            rel="noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Download PDF
          </a>
        </div>
      )}

      {/* Lesson Notes */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-sm">
            📝
          </span>
          Lesson Notes
        </h2>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-gray-700 leading-relaxed">
          {lesson.content}
        </div>
      </div>

      {/* AI Tools */}
      <div className="mb-8 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          AI Learning Tools
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Generate a summary or test your knowledge with a quiz.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleSummary}
            disabled={loadingSummary}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loadingSummary ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              "✨ Generate Summary"
            )}
          </button>
          <button
            onClick={handleQuiz}
            disabled={loadingQuiz}
            className="flex items-center gap-2 bg-white border border-violet-200 hover:bg-violet-50 text-violet-700 font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loadingQuiz ? (
              <>
                <span className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              "🧠 Generate Quiz"
            )}
          </button>
        </div>

        {/* Summary Result */}
        {summary && (
          <div className="mt-5 bg-white rounded-xl border border-violet-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              ✨ Summary
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Quiz Result */}
        {quiz && (
          <div className="mt-5 bg-white rounded-xl border border-violet-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              🧠 Quiz
            </h3>
            <div className="space-y-4">
              {Array.isArray(quiz) ? (
                quiz.map((q, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-800 text-sm mb-2">
                      {idx + 1}. {q.question}
                    </p>
                    {q.options && (
                      <ul className="space-y-1">
                        {q.options.map((opt, oi) => (
                          <li key={oi} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-gray-400">{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                  {JSON.stringify(quiz, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonDetailPage;
