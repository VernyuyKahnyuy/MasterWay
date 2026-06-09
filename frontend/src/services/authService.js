import api from "./api";

export const loginUser = async (username, password) => {

  const response = await api.post(
    "/token/",
    {
      username,
      password,
    }
  );

  return response.data;
};


export const registerUser = async (
  username,
  email,
  password,
  role
) => {

  const response = await api.post(
    "users/register/",
    {
      username,
      email,
      password,
      role,
    }
  );

  return response.data;
};