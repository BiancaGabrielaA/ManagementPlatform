import api from "./axios";

export type TicketStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface CreateTicketDto {
  title: string;
  description: string | null;
  priority: Priority;
  teamId: number;
  assigneeId: number | null;
}

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: Priority;
  teamId: number;
  team?: { id: number; name: string } | null;
  assignee?: {
    id: number;
    name: string;
    email: string;
  } | null;
  sprint?: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
}

export async function getTicketsByTeam(teamId: number) {
  const response = await api.get(`/tickets/team/${teamId}`);
  return response.data;
}

export async function updateTicketStatus(
  ticketId: number,
  status: TicketStatus
): Promise<Ticket> {
  const response = await api.patch(`/tickets/${ticketId}/status`, { status });
  return response.data;
}

export async function deleteTicket(ticketId: number)
{
  const response = await api.delete(`/tickets/${ticketId}`);
  return response.data;
}

export async function createTicket(dto: CreateTicketDto): Promise<Ticket> {
  const response = await api.post("/tickets", dto);
  return response.data;
}

export async function getBacklog(teamId: number): Promise<Ticket[]> {
  const response = await api.get(`/tickets/team/${teamId}/backlog`);
  return response.data;
}

export async function getTicketById(id: number): Promise<Ticket> {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
}

export async function updateTicket(
  id: number,
  data: Partial<Pick<Ticket, "status" | "priority" | "title" | "description"> & {
      assigneeId: number | null;
      sprintId: number | null;
    }>
): Promise<Ticket> {
  const response = await api.patch(`/tickets/${id}`, data);
  return response.data;
}

export async function getMyTickets(): Promise<Ticket[]> {
  const response = await api.get("/tickets/mine");
  return response.data;
}

export async function getNeedsAttention(): Promise<Ticket[]> {
  try {
    const response = await api.get("/tickets/need-attention");
    return response.data;
  } catch (err) {
    throw err;
  }
}