import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLessonsByRoom } from "../services/lessonService";
import { getRoom } from "../services/roomService";
import { enrollInRoom } from "../services/enrollmentService";
import { getCommentsByRoom, createComment } from "../services/commentService";
import { formatDate } from "../utils/dateFormatter";
import { Link } from "react-router-dom";

function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoom(id);
        setRoom(roomData);
        const lessonData = await getLessonsByRoom(id);
        setLessons(lessonData);

        const commentData = await getCommentsByRoom(id);
        setComments(commentData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoom();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await enrollInRoom(id);
      alert("Enrolled successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to enroll.");
    }
  };

  const handleComment = async () => {
    try {
      await createComment(id, commentText);

      const updatedComments = await getCommentsByRoom(id);
      setComments(updatedComments);
      setCommentText("");
    } catch (error) {
      console.error(error);
      alert("Failed to create comment.");
    }
  };

  if (!room) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      {room.cover_image && (
        <img
          src={room.cover_image}
          alt={room.title}
          style={{
            width: "250px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
      )}

      <h1>{room.title}</h1>

      <p>{room.description}</p>

      <button onClick={handleEnroll}>Enroll in this room</button>

      <h2>Lessons</h2>

      {lessons.length === 0 ? (
        <p>No lessons available.</p>
      ) : (
        lessons.map((lesson) => (
          <div key={lesson.id}>
            <h3>
              {" "}
              <Link to={`/lessons/${lesson.id}`}>{lesson.title}</Link>
            </h3>
            <p>{lesson.content}</p>
          </div>
        ))
      )}

      <hr />

      <h2>Discussion</h2>

      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
      />

      <button onClick={handleComment}>Post Comment</button>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <Link to={`/profiles/${comment.user}`}>
              <strong>{comment.username}</strong>
            </Link>
            <small> - {formatDate(comment.created_at)}</small>
            <p>{comment.text}</p>
          </div>
        ))
      )}

      <Link to={`/messages/send/${room.creator}`}>Message Expert</Link>
    </div>
  );
}

export default RoomDetailPage;
