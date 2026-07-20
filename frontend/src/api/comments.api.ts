import api from "./axios";

export interface Comment {
  id: number;
  content: string;
  ticketId: number;
  authorId: number;
  author: { id: number; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export async function getCommentsByTicket(ticketId: number): Promise<Comment[]> {
  const response = await api.get(`/tickets/${ticketId}/comments`);
  return response.data;
}

export async function createComment(ticketId: number, content: string): Promise<Comment> {
  const response = await api.post(`/tickets/${ticketId}/comments`, { content });
  return response.data;
}

export async function updateComment(
  ticketId: number,
  commentId: number,
  content: string
): Promise<Comment> {
  const response = await api.patch(`/tickets/${ticketId}/comments/${commentId}`, { content });
  return response.data;
}

export async function deleteComment(ticketId: number, commentId: number): Promise<void> {
  await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
}