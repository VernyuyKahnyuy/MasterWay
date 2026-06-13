import api from "./api";

export const markLessonComplete = async ( lessonId ) => {
  const response = await api.post( 
    "enrollments/progress/create/", {
      lesson: lessonId
    }
  );

  return response.data;
};


export const getProgress = async () => {
  const response = await api.get(
    "enrollments/progress/"
  );

  return response.data;
};