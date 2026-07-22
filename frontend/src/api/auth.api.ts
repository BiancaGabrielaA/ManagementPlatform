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
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
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

export async function changePassword(dto: ChangePasswordDto): Promise<void> {
  const response = await api.patch("/auth/change-password", dto);
  return response.data;
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const response = await api.get(`/auth/verify-email?token=${token}`);
  return response.data;
}