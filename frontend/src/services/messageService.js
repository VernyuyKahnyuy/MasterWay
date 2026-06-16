import api from "./api";

export const getInbox = async () => {
  const response = await api.get("/messages/inbox/");

  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post("/messages/send/", messageData);

  return response.data;
};
