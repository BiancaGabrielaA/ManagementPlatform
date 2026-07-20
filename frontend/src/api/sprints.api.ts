import api from "./axios";
import type { Ticket } from "./tickets.api";

export interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  teamId: number;
  tickets: Ticket[];
}

export interface CreateSprintDto {
  name: string;
  startDate: string;
  endDate: string;
  teamId: number;
}

export async function getSprintsByTeam(teamId: number): Promise<Sprint[]> {
  const response = await api.get(`/sprints/team/${teamId}`);
  return response.data;
}

export async function createSprint(dto: CreateSprintDto): Promise<Sprint> {
  const response = await api.post("/sprints", dto);
  return response.data;
}

export async function assignTicketToSprint(
  sprintId: number,
  ticketId: number
): Promise<Ticket> {
  const response = await api.patch(`/sprints/${sprintId}/tickets/${ticketId}`);
  return response.data;
}

export async function removeTicketFromSprint(ticketId: number): Promise<Ticket> {
  const response = await api.patch(`/sprints/tickets/${ticketId}/remove`);
  return response.data;
}