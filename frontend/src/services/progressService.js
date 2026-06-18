import api from "./api";

export const markLessonComplete = async (lessonId) => {
  const response = await api.post("enrollments/progress/create/", {
    lesson: lessonId,
  });

  return response.data;
};

export const getProgress = async () => {
  const response = await api.get("enrollments/progress/");
  const data = response.data;
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const getContinueLearning = async () => {
  const response = await api.get("/enrollments/continue-learning/");

  return response.data;
};
