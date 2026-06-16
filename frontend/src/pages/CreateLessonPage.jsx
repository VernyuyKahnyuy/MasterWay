import { useState, useEffect, use } from "react";
import { getMyRooms } from "../services/roomService";
import { createLesson } from "../services/lessonService";

function CreateLessonPage() {
  const [rooms, setRooms] = useState([]);

  const [room, setRoom] = useState("");

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

  const [pdf, setPdf] = useState(null);

  const [image, setImage] = useState(null);

  const [order, setOrder] = useState(1);

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getMyRooms();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("room", room);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("video_url", videoUrl);

    if (pdf) {
      formData.append("pdf", pdf);
    }

    if (image) {
      formData.append("image", image);
    }

    await createLesson(formData);

    alert("Lesson Created!");
  };

  return (
    <div>
      <h1>Create Lesson</h1>

      <form onSubmit={handleSubmit}>
        <label>Room</label>

        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">Select Room</option>

          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.title}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Lesson Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <label>Lesson Content</label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <br />
        <br />

        <label>YouTube Video URL</label>

        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <br />
        <br />

        <label>Supporting Image (Optional)</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <br />
        <br />

        <label>PDF Notes (Optional)</label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdf(e.target.files[0])}
        />

        <br />
        <br />

        <label>Lesson Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
        <br />
        <br />

        <button type="submit">Create Lesson</button>
      </form>
    </div>
  );
}

export default CreateLessonPage;
