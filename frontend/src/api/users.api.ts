import api from "./axios";

export type Role = "ADMIN" | "SOFTWARE_ENGINEER" | "PROJECT_MANAGER" | "SOFTWARE_TESTER";

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export async function getAllUsers(): Promise<UserListItem[]> {
  const response = await api.get("/users/all");
  return response.data;
}

export async function updateUser(id: number, data: Partial<Pick<UserListItem, "name" | "email" | "role">>) {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}