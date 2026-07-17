import api from "./axios";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}


export async function registerUser(
  data: RegisterRequest
) {
  const response = await api.post(
    "/auth/register",
    data,
     {
      withCredentials: true,
    }
  );

  return response.data;
}


export async function loginUser(
  data: LoginRequest
) {
  const response = await api.post(
    "/auth/login",
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me", {
    withCredentials: true,
  });
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}