import api from "./axios";

export interface Activity {
  id: number;
  type: string;
  description: string;
  actor: { name: string };
  ticket: { title: string } | null;
  team: { name: string };
  createdAt: string;
}

export async function getRecentActivities(limit = 5): Promise<Activity[]> {
  const response = await api.get(`/activities/recent?limit=${limit}`);
  return response.data;
}