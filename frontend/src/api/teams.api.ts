import api from "./axios"
import type { UserListItem } from "./users.api";

export interface Team {
  id: number;
  name: string;
  description: string | null;
  users: UserListItem[];
}

export async function getAllTeams(): Promise<Team[]> {
  const response = await api.get("/teams/all");
  return response.data;
}

export async function createTeam(data: { name: string; description?: string }): Promise<Team> {
  const response = await api.post("/teams/create", data);
  return response.data;
}

export async function deleteTeam(id: number) {
  const response = await api.delete(`/teams/${id}`);
  return response.data;
}

export async function addUserToTeam(teamId: number, userId: number) {
  const response = await api.post(`/teams/${teamId}/users/${userId}`);
  return response.data;
}

export async function deleteUserFromTeam(teamId: number, userId: number) {
  const response = await api.delete(`/teams/${teamId}/users/${userId}`);
  return response.data;
}