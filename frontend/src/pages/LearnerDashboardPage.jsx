import { useEffect, useState } from "react";
import { getContinueLearning } from "../services/progressService";
import { getProgress } from "../services/progressService";
import { Link } from "react-router-dom";

function LearnerDashboardPage() {
  const [progress, setProgress] = useState([]);
  const [continueLearning, setContinueLearning] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProgress();
      const continueData = await getContinueLearning();

      setContinueLearning(continueData);

      setProgress(data);
    };

    fetchData();
  }, []);

  const completedLessons = progress.length;

  const totalLessons = 20;

  const percentage = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <div>
      <h2>Completed Lessons: {completedLessons}</h2>
      <h2>Progress: {percentage}%</h2>

      <h2>Continue Learning</h2>

      {continueLearning && continueLearning.lesson_id && (
        <div>
          <p>Room: {continueLearning.room_title}</p>

          <p>Next Lesson: {continueLearning.lesson_title}</p>

          <Link to={`/lessons/${continueLearning.lesson_id}`}>
            Resume Learning
          </Link>
        </div>
      )}

      <h2>Completed Lessons</h2>

      {progress.map((item) => (
        <div key={item.id}>✓ {item.lesson_title}</div>
      ))}
    </div>
  );
}

export default LearnerDashboardPage;
