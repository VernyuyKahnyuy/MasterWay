import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getRoom } from "../services/roomService";

import { getLessonsByRoom } from "../services/lessonService";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { deleteLesson } from "../services/lessonService";

function ManageRoomPage() {
  const { id } = useParams();

  const [room, setRoom] = useState(null);

  const [lessons, setLessons] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomData = await getRoom(id);

        const lessonsData = await getLessonsByRoom(id);

        setRoom(roomData);

        setLessons(lessonsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async (lessonId) => {
    const confirmed = window.confirm("Delete this lesson?");

    if (!confirmed) return;

    try {
      await deleteLesson(lessonId);

      setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
    } catch (error) {
      console.error(error);
    }
  };

  if (!room) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{room.title}</h1>

      <p>{room.description}</p>

      {room.cover_image && (
        <img
          src={room.cover_image}
          alt={room.title}
          style={{
            width: "300px",
          }}
        />
      )}

      <h2>Lessons</h2>

      {lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        lessons.map((lesson) => (
          <div key={lesson.id}>
            <h3>
              {lesson.order}. {lesson.title}
            </h3>

            <button
              onClick={() => navigate(`/expert/lesson/${lesson.id}/edit`)}
            >
              Edit
            </button>

            <button onClick={() => handleDelete(lesson.id)}>Delete</button>

            <hr />
          </div>
        ))
      )}

      <button type="button" onClick={() => navigate("/expert/create-lesson")}>
        Create New Lesson
      </button>
    </div>
  );
}

export default ManageRoomPage;
