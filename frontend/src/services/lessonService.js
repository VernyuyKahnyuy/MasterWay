import api from "./api";

export const getLessonsByRoom = async (roomId) => {
    const response = await api.get(
        `lessons/?room=${roomId}`
    );
    return response.data;
};