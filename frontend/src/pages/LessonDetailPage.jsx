import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLesson } from "../services/lessonService";
import { markLessonComplete, getProgress } from "../services/progressService";
import { createUpdate } from "../services/accountabilityService";
import { generateSummary, generateQuiz } from "../services/aiService";
import { getCurrentUserId } from "../utils/auth";
import MarkdownText from "../components/MarkdownText";

function LessonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [quizError, setQuizError] = useState("");
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      console.log(`[LessonDetailPage] Loading lesson ${id}`);
      try {
        const [data, progressList] = await Promise.all([
          getLesson(id),
          currentUserId ? getProgress() : Promise.resolve([]),
        ]);
        setLesson(data);
        if (progressList.some((p) => String(p.lesson) === String(id))) {
          setCompleted(true);
        }
        console.log(`[LessonDetailPage] Loaded lesson: "${data.title}"`);
      } catch (error) {
        console.error("[LessonDetailPage] Failed to load lesson:", error);
      }
    };
    fetchLesson();
  }, [id]);

  const handleComplete = async () => {
    setMarking(true);
    try {
      await markLessonComplete(id);
      setCompleted(true);
      console.log(`[LessonDetailPage] Lesson ${id} marked complete`);
      if (lesson?.room) {
        await createUpdate({
          room: lesson.room,
          content: `Completed lesson: "${lesson.title}"`,
        });
      }
    } catch (error) {
      console.error("[LessonDetailPage] Failed to mark lesson complete:", error);
    } finally {
      setMarking(false);
    }
  };

  const handleSummary = async () => {
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const data = await generateSummary(id);
      setSummary(data.summary);
    } catch (error) {
      setSummaryError(
        error.response?.data?.error ??
        "Failed to generate summary. The AI may be busy — please try again in a moment."
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleQuiz = async () => {
    setLoadingQuiz(true);
    setQuizError("");
    try {
      const data = await generateQuiz(id);
      setQuiz(data.quiz);
    } catch (error) {
      setQuizError(
        error.response?.data?.error ??
        "Failed to generate quiz. The AI may be busy — please try again in a moment."
      );
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
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-700 font-medium transition-colors mb-6"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {currentUserId === lesson.creator ? (
            <>
              <span className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                Owned by you
              </span>
              <Link
                to={`/expert/lesson/${id}/edit`}
                className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Edit Lesson
              </Link>
            </>
          ) : (
            <>
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
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Message Expert
              </Link>
            </>
          )}
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
            <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
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
            <svg className="w-7 h-7 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
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
          <span className="w-7 h-7 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
              <><svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg> Generate Summary</>

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
              <><svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg> Generate Quiz</>

            )}
          </button>
        </div>

        {/* AI error banners */}
        {summaryError && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.3)", color: "#dc2626" }}>
            <span className="text-base shrink-0">⚠️</span>
            <div>
              <p className="font-semibold mb-0.5">Summary unavailable</p>
              <p>{summaryError}</p>
            </div>
          </div>
        )}
        {quizError && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.3)", color: "#dc2626" }}>
            <span className="text-base shrink-0">⚠️</span>
            <div>
              <p className="font-semibold mb-0.5">Quiz unavailable</p>
              <p>{quizError}</p>
            </div>
          </div>
        )}

        {/* Summary Result */}
        {summary && (
          <div className="mt-5 bg-white rounded-xl border border-violet-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              Summary
            </h3>
            <MarkdownText text={summary} />
          </div>
        )}

        {/* Quiz Result */}
        {quiz && (
          <div className="mt-5 bg-white rounded-xl border border-violet-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
              Quiz
            </h3>
            <MarkdownText text={typeof quiz === "string" ? quiz : JSON.stringify(quiz, null, 2)} />
          </div>
        )}
      </div>

      {/* Mark Complete — bottom CTA (learners only, logged in) */}
      {!currentUserId ? (
        <div
          className="mt-2 mb-10 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "rgba(0,200,255,0.04)", borderColor: "rgba(0,200,255,0.2)" }}
        >
          <div>
            <p className="font-semibold text-gray-800 mb-1">Track your progress</p>
            <p className="text-sm text-gray-500">Log in to mark this lesson complete and post it to the accountability feed.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              to="/login"
              className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ background: "#00C8FF", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}
            >
              LOG IN
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold px-5 py-2.5 rounded-xl border transition-colors hover:bg-gray-50"
              style={{ color: "var(--cyber-text)", borderColor: "rgba(0,200,255,0.3)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}
            >
              REGISTER
            </Link>
          </div>
        </div>
      ) : currentUserId !== lesson.creator && (
        <div className="mt-2 mb-10 flex flex-col items-center gap-3">
          {completed ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-semibold px-8 py-4 rounded-2xl text-base">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              Lesson Completed
            </div>
          ) : (
            <>
              <button
                onClick={handleComplete}
                disabled={marking}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-2xl shadow transition-colors disabled:opacity-60 text-base"
              >
                {marking ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Marking complete...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    Mark Lesson Complete
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400">This will appear in the accountability feed and your progress</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LessonDetailPage;
