import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLesson } from "../services/lessonService";
import { markLessonComplete } from "../services/progressService";
import { Link } from "react-router-dom";
import { generateSummary, generateQuiz } from "../services/aiService";

function LessonDetailPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

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
    try {
      await markLessonComplete(id);
      setCompleted(true);
    } catch (error) {
      console.error(error);
      alert("Could not mark complete");
    }
  };

  const handleSummary = async () => {
    try {
      setLoadingSummary(true);
      const data = await generateSummary(id);
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleQuiz = async () => {
    try {
      setLoadingQuiz(true);
      const data = await generateQuiz(id);
      setQuiz(data.quiz);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  if (!lesson) {
    return <h2>Loading...</h2>;
  }

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];

    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div>
      <h1>{lesson.title}</h1>

      {/* Image */}
      <h3>Image</h3>
      {lesson.image && (
        <div>
          <img
            src={lesson.image}
            alt={lesson.title}
            style={{
              maxWidth: "100%",
              marginBottom: "20px",
            }}
          />
        </div>
      )}

      {/* {Video} */}

      {lesson.video_url && (
        <div>
          <h3>Video Lesson </h3>

          <iframe
            width="100%"
            height="400"
            src={getYoutubeEmbedUrl(lesson.video_url)}
            title="Lesson Video"
            allowFullScreen
          />
        </div>
      )}

      {/* {PDF} */}

      {lesson.pdf && (
        <div>
          <h3>PDF Material</h3>
          <a href={lesson.pdf} target="_blank" rel="noreferrer">
            Download PDF
          </a>
        </div>
      )}

      {/* {Text Content} */}
      <h3>Lesson Notes</h3>
      <p>{lesson.content}</p>

      <button onClick={handleSummary} disabled={loadingSummary}>
        {loadingSummary ? "Generating Summary..." : "Generate Summary"}
      </button>

      <button onClick={handleQuiz} disabled={loadingQuiz}>
        {loadingQuiz ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {completed ? (
        <p>✅ Lesson Completed</p>
      ) : (
        <button onClick={handleComplete}>Mark Complete </button>
      )}

      {loadingSummary && <p>Generating summary...</p>}
      {loadingQuiz && <p>Generating quiz...</p>}

      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {quiz && (
        <div>
          <h3>Quiz:</h3>
          <pre>{JSON.stringify(quiz, null, 2)}</pre>
        </div>
      )}

      <Link to={`/messages/send/${lesson.creator}`}>Message Expert</Link>
    </div>
  );
}

export default LessonDetailPage;
