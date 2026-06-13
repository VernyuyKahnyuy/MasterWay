import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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


  return (

    <div>

      <h1>
        {lesson.title}
      </h1>

      <p>
        {lesson.content}
      </p>

      <button onClick={handleSummary} disabled={loadingSummary}>
        {loadingSummary ? "Generating Summary..." : "Generate Summary"}
      </button>
      
      <button onClick={handleQuiz} disabled={loadingQuiz}>
        {loadingQuiz ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {completed ? (
        
        <p>✅ Lesson Completed</p> 
    
    ) : ( 
    
    <button onClick={handleComplete}  > 
        Mark Complete </button> 
    
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


    </div>
  );
}

export default LessonDetailPage;