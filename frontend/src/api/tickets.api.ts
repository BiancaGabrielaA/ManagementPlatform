import api from "./axios";

export interface Ticket {
  id: number;
  name: string;
  description: string | null;
  
}

export interface TicketStatus {
  id: number;
  name: string;
  description: string | null;
}

export async function getTicketsByTeam() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export async function updateTicketStatus() {
  const response = await api.post("/auth/logout");
  return response.data;
}