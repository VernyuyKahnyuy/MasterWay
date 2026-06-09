import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLessonsByRoom } from "../services/lessonService";
import { getRoom }
from "../services/roomService";

function RoomDetailPage() {

  const { id } = useParams();

  const [room, setRoom] =
    useState(null);
    
  const [lessons, setLessons] = useState([]);

  useEffect(() => {

    const fetchRoom = async () => {

      try {

        const roomData =
          await getRoom(id);

        setRoom(roomData);

        const lessonData = await getLessonsByRoom(id);
        
        setLessons(lessonData);

      } catch (error) {

        console.error(error);
      }
    };

    fetchRoom();

  }, [id]);


  if (!room) {

    return <h2>Loading...</h2>;
  }


  return (
    <div>

      <h1>{room.title}</h1>

      <p>{room.description}</p>

      <h2>Lessons</h2>

      {lessons.length === 0 ? (
        
        <p>No lessons available.</p>

      ) : (
        
        lessons.map((lesson) => (
          <div key={lesson.id}>
            <h3>{lesson.title}</h3>
            {/* <p>{lesson.content}</p> */}
          </div>
        ))
      )}

    </div>
  );
}

export default RoomDetailPage;