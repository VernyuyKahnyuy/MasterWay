import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

function EditLessonPage() {
  const { id } = useParams();

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      const response = await api.get(`/lessons/${id}/`);

      const lesson = response.data;

      setTitle(lesson.title);

      setContent(lesson.content);

      setVideoUrl(lesson.video_url);
    };

    fetchLesson();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);

    formData.append("content", content);

    formData.append("video_url", videoUrl);

    await api.put(`/lessons/${id}/update/`, formData);

    alert("Lesson Updated");
  };

  return (
    <div>
      <h1>Edit Lesson</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditLessonPage;
