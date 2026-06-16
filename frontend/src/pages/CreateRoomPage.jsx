import { useState } from "react";
import { createRoom } from "../services/roomService";

function CreateRoomPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);

      formData.append("description", description);

      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      await createRoom(formData);

      alert("Room created!");

      setTitle("");
      setDescription("");
      setCoverImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create Room</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <h3>Room Display Image</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])}
        />

        <br />
        <br />

        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}

export default CreateRoomPage;
