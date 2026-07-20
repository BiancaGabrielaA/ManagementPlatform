import { useEffect, useState } from "react";
import { getTicketById, updateTicket } from "../../../api/tickets.api";
import type { Ticket, TicketStatus, Priority } from "../../../api/tickets.api";
import { getAllUsers } from "../../../api/users.api";
import type { UserListItem } from "../../../api/users.api";
import {
  getCommentsByTicket,
  createComment,
  updateComment,
  deleteComment,
} from "../../../api/comments.api";
import type { Comment } from "../../../api/comments.api";
import { useAuth } from "../../../auth/AuthContext";
import { getSprintsByTeam, type Sprint } from "@/api/sprints.api";

interface Props {
  ticketId: number;
  teamId: number;
  onClose: () => void;
  onUpdated: (ticket: Ticket) => void;
}

const STATUS_OPTIONS: TicketStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const PRIORITY_OPTIONS: Priority[] = ["LOW", "MEDIUM", "HIGH"];

const STATUS_COLORS: Record<TicketStatus, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700"
};

interface PendingChanges {
  title?: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: Priority;
  assigneeId?: number | null;
  sprintId?: number | null;
}

function TicketDetailModal({ ticketId, teamId, onClose, onUpdated }: Props) {
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [members, setMembers] = useState<UserListItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [pending, setPending] = useState<PendingChanges>({});

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentDraft, setEditingCommentDraft] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const displaySprintId = pending.sprintId !== undefined ? pending.sprintId : ticket?.sprint?.id ?? null;

  useEffect(() => {
    loadData();
  }, [ticketId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ticketData, commentsData, usersData, sprintsData] = await Promise.all([
        getTicketById(ticketId),
        getCommentsByTicket(ticketId),
        getAllUsers(),
        getSprintsByTeam(teamId),
      ]);
      setTicket(ticketData);
      setComments(commentsData);
      setMembers(usersData);
      setSprints(sprintsData);
    } catch {
      setError("Nu am putut încărca ticketul.");
    } finally {
      setIsLoading(false);
    }
  };

  // valorile afișate: pending are prioritate față de ticket (draft peste original)
  const displayTitle = pending.title ?? ticket?.title ?? "";
  const displayDescription = pending.description ?? ticket?.description ?? "";
  const displayStatus = pending.status ?? ticket?.status;
  const displayPriority = pending.priority ?? ticket?.priority;
  const displayAssigneeId =
    pending.assigneeId !== undefined ? pending.assigneeId : ticket?.assignee?.id ?? null;

  const hasChanges = Object.keys(pending).length > 0;

  const setField = <K extends keyof PendingChanges>(key: K, value: PendingChanges[K]) => {
    setPending((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    console.log(pending);
    if (!ticket || !hasChanges) return;
    setIsSaving(true);
    try {
      const updated = await updateTicket(ticket.id, pending);
      setTicket(updated);
      onUpdated(updated);
      setPending({});
    } catch {
      setError("Nu am putut salva modificările.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setPending({});
  };

  const handleClose = () => {
    if (hasChanges && !confirm("Ai modificări nesalvate. Închizi fără să salvezi?")) return;
    onClose();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const comment = await createComment(ticketId, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch {
      setError("Nu am putut adăuga comentariul.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSaveEditedComment = async (commentId: number) => {
    if (!editingCommentDraft.trim()) return;
    try {
      const updated = await updateComment(ticketId, commentId, editingCommentDraft.trim());
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingCommentId(null);
    } catch {
      setError("Nu am putut edita comentariul.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Ștergi acest comentariu?")) return;
    try {
      await deleteComment(ticketId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Nu am putut șterge comentariul.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <span className="text-xs font-mono text-slate-400">
            {ticket ? `#${ticket.id}` : "..."}
          </span>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-xs text-amber-600 font-medium">Modificări nesalvate</span>
            )}
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">
              ×
            </button>
          </div>
        </div>

        {isLoading && <p className="p-6 text-sm text-slate-500">Se încarcă...</p>}
        {error && <p className="px-6 pt-3 text-sm text-red-600">{error}</p>}

        {ticket && (
          <>
            <div className="flex flex-1 overflow-hidden">
              {/* Main content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* Title */}
                <div>
                  <input
                    value={displayTitle}
                    onChange={(e) => setField("title", e.target.value)}
                    className="w-full text-lg font-semibold text-slate-900 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded-md px-2 py-1 -mx-2 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Descriere</p>
                  <textarea
                    value={displayDescription}
                    onChange={(e) => setField("description", e.target.value)}
                    rows={5}
                    placeholder="Adaugă o descriere..."
                    className="w-full text-sm text-slate-700 border border-transparent hover:border-slate-200 focus:border-slate-300 rounded-md px-2 py-2 -mx-2 resize-none focus:outline-none"
                  />
                </div>

                {/* Comments — rămân live, nu fac parte din draft */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                    Comentarii ({comments.length})
                  </p>

                  <div className="space-y-3 mb-4">
                    {comments.map((comment) => {
                      const isOwner = comment.authorId === user?.id;
                      const isEditing = editingCommentId === comment.id;

                      return (
                        <div key={comment.id} className="border border-slate-200 rounded-md p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-700">
                              {comment.author.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">
                                {new Date(comment.createdAt).toLocaleString("ro-RO")}
                              </span>
                              {isOwner && !isEditing && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(comment.id);
                                      setEditingCommentDraft(comment.content);
                                    }}
                                    className="text-xs text-slate-500 hover:text-slate-700"
                                  >
                                    Editează
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-xs text-red-500 hover:text-red-700"
                                  >
                                    Șterge
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                autoFocus
                                value={editingCommentDraft}
                                onChange={(e) => setEditingCommentDraft(e.target.value)}
                                rows={2}
                                className="w-full text-sm border border-slate-300 rounded-md px-2 py-1 resize-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEditedComment(comment.id)}
                                  className="text-xs font-medium bg-slate-900 text-white px-2 py-1 rounded-md"
                                >
                                  Salvează
                                </button>
                                <button
                                  onClick={() => setEditingCommentId(null)}
                                  className="text-xs text-slate-500 px-2 py-1"
                                >
                                  Anulează
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {comments.length === 0 && (
                      <p className="text-sm text-slate-400 italic">Niciun comentariu încă.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Scrie un comentariu..."
                      rows={2}
                      className="flex-1 text-sm border border-slate-300 rounded-md px-3 py-2 resize-none"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 disabled:opacity-50 self-end"
                    >
                      Trimite
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-64 border-l border-slate-200 px-4 py-4 space-y-4 overflow-y-auto bg-slate-50">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                  <select
                    value={displayStatus}
                    onChange={(e) => setField("status", e.target.value as TicketStatus)}
                    className={`w-full text-sm rounded-md px-2 py-1.5 border-none font-medium ${STATUS_COLORS[displayStatus!]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Prioritate</p>
                  <select
                    value={displayPriority}
                    onChange={(e) => setField("priority", e.target.value as Priority)}
                    className={`w-full text-sm rounded-md px-2 py-1.5 border-none font-medium ${PRIORITY_COLORS[displayPriority!]}`}
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Assignee</p>
                  <select
                    value={displayAssigneeId ?? ""}
                    onChange={(e) =>
                      setField("assigneeId", e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white"
                  >
                    <option value="">Neasignat</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Sprint</p>
                  <select
                    value={displaySprintId ?? ""}
                    onChange={(e) =>
                      setField("sprintId", e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white"
                  >
                    <option value="">Backlog</option>
                    {sprints.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Creat</p>
                  <p className="text-sm text-slate-700">
                    {new Date(ticket.createdAt).toLocaleDateString("ro-RO")}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer — Save bar */}
            <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200">
              {hasChanges && (
                <button
                  onClick={handleDiscard}
                  className="text-sm text-slate-600 px-3 py-1.5 rounded-md hover:bg-slate-100"
                >
                  Anulează modificările
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="text-sm font-medium bg-slate-900 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Se salvează..." : "Save changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TicketDetailModal;