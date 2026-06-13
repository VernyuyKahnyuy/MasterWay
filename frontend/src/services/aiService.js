import api from "./api";

export const generateSummary = async (
  lessonId
) => {

  const response = await api.post(
    "ai/summarize/",
    {
      lesson_id: lessonId
    }
  );

  return response.data;
};

export const generateQuiz = async (
  lessonId
) => {

  const response = await api.post(
    "ai/quiz/",
    {
      lesson_id: lessonId
    }
  );

  return response.data;
};