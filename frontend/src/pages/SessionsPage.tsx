import { useEffect, useState } from "react";
import { getMySessions, updateSession, createReview } from "../services/api";
import { Session } from "../types";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Star, TrendingUp, CheckCheck, FileText, Video, Mic, MessageSquare, MapPin } from "lucide-react";

const SessionsPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<Session | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", skill_transfer_percent: 70 });
  const [noteTarget, setNoteTarget] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const load = async () => {
    try { const r = await getMySessions(); setSessions(r.data.data); }
    catch { toast.error("Failed to load sessions"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleMarkComplete = async (id: string, transferPercent: number) => {
    try {
      await updateSession(id, { status: "completed", skill_transfer_percent: transferPercent });
      toast.success("Session marked complete! ✅");
      load();
    } catch { toast.error("Failed"); }
  };

  const handleSaveNote = async (id: string) => {
    try {
      await updateSession(id, { notes: noteText });
      toast.success("Note saved!");
      setNoteTarget(null);
      load();
    } catch { toast.error("Failed"); }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget || !user) return;
    const revieweeId = reviewTarget.teacher_id === user.id ? reviewTarget.learner_id : reviewTarget.teacher_id;
    try {
      await createReview({ session_id: reviewTarget.id, reviewee_id: revieweeId, ...reviewForm });
      toast.success("Review submitted! ⭐");
      setReviewTarget(null);
      load();
    } catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const modeIcon: Record<string, JSX.Element> = {
    video: <Video size={14} color="#6366f1" />,
    audio: <Mic size={14} color="#10b981" />,
    chat: <MessageSquare size={14} color="#f59e0b" />,
    offline: <MapPin size={14} color="#ec4899" />,
  };

  const scheduled = sessions.filter(s => s.status === "scheduled");
  const completed = sessions.filter(s => s.status === "completed");

  if (loading) return <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ color: "#f1f5f9", marginBottom: "2rem", fontWeight: 700 }}>My Sessions</h1>

        {/* Upcoming */}
        <h2 style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>📅 Upcoming ({scheduled.length})</h2>
        {scheduled.length === 0
          ? <div style={{ background: "#1e293b", borderRadius: "10px", padding: "2rem", textAlign: "center", border: "1px dashed #334155", marginBottom: "2rem" }}>
              <p style={{ color: "#475569", margin: 0, fontSize: "0.85rem" }}>No upcoming sessions. Accept a swap and schedule one!</p>
            </div>
          : scheduled.map(s => <SessionCard key={s.id} session={s} userId={user!.id} modeIcon={modeIcon} onMarkComplete={handleMarkComplete} onNote={id => { setNoteTarget(id); setNoteText(s.notes || ""); }} onReview={setReviewTarget} />)
        }

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <h2 style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", margin: "2rem 0 1rem" }}>✅ Completed ({completed.length})</h2>
            {completed.map(s => <SessionCard key={s.id} session={s} userId={user!.id} modeIcon={modeIcon} onMarkComplete={handleMarkComplete} onNote={id => { setNoteTarget(id); setNoteText(s.notes || ""); }} onReview={setReviewTarget} />)}
          </>
        )}
      </div>

      {/* Note Modal */}
      {noteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "460px", border: "1px solid #334155" }}>
            <h3 style={{ color: "#f1f5f9", margin: "0 0 1rem", fontWeight: 700 }}>Session Notes</h3>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="What was covered in this session? Key learnings..." rows={5} style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#f1f5f9", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "Inter, sans-serif" }} />
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button onClick={() => handleSaveNote(noteTarget)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>Save Notes</button>
              <button onClick={() => setNoteTarget(null)} style={{ background: "transparent", color: "#64748b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "460px", border: "1px solid #334155" }}>
            <h3 style={{ color: "#f1f5f9", margin: "0 0 0.5rem", fontWeight: 700 }}>Rate this Session</h3>
            <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "1.5rem" }}>Rate {reviewTarget.teacher_id === user?.id ? reviewTarget.learner_name : reviewTarget.teacher_name}</p>
            <form onSubmit={handleReview}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "8px" }}>Rating</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <Star size={28} color="#f59e0b" fill={n <= reviewForm.rating ? "#f59e0b" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "6px" }}>Skill Transfer % — How much did you learn?</label>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <input type="range" min={0} max={100} value={reviewForm.skill_transfer_percent} onChange={e => setReviewForm({ ...reviewForm, skill_transfer_percent: Number(e.target.value) })} style={{ flex: 1 }} />
                  <span style={{ color: "#10b981", fontWeight: 700, fontSize: "1rem", minWidth: "45px" }}>{reviewForm.skill_transfer_percent}%</span>
                </div>
                <div style={{ height: "6px", background: "#334155", borderRadius: "3px", marginTop: "6px" }}>
                  <div style={{ height: "100%", width: `${reviewForm.skill_transfer_percent}%`, background: "linear-gradient(90deg, #6366f1, #10b981)", borderRadius: "3px", transition: "width 0.2s" }} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "6px" }}>Comment (optional)</label>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience..." rows={3} style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px", color: "#f1f5f9", fontSize: "0.875rem", resize: "none", boxSizing: "border-box", outline: "none", fontFamily: "Inter, sans-serif" }} />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>Submit Review ⭐</button>
                <button type="button" onClick={() => setReviewTarget(null)} style={{ background: "transparent", color: "#64748b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SessionCard = ({ session: s, userId, modeIcon, onMarkComplete, onNote, onReview }: any) => {
  const [transfer, setTransfer] = useState(s.skill_transfer_percent || 0);
  return (
    <div style={{ background: "#1e293b", borderRadius: "12px", padding: "1.25rem", border: "1px solid #334155", marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            {modeIcon[s.mode]}
            <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem" }}>
              {s.teacher_id === userId ? `Teaching: ${s.sender_skill_title}` : `Learning: ${s.receiver_skill_title}`}
            </span>
          </div>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.8rem" }}>
            with {s.teacher_id === userId ? s.learner_name : s.teacher_name} · {new Date(s.scheduled_at).toLocaleString()} · {s.duration_minutes}min
          </p>
        </div>
        <span style={{ background: s.status === "completed" ? "#10b98120" : "#6366f120", color: s.status === "completed" ? "#10b981" : "#6366f1", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>
          {s.status}
        </span>
      </div>

      {s.meet_link && <a href={s.meet_link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#6366f1", fontSize: "0.8rem", background: "#6366f115", padding: "5px 12px", borderRadius: "6px", textDecoration: "none", marginBottom: "0.75rem" }}><Video size={12} /> Join Call</a>}
      {s.location_note && <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0 0 0.75rem" }}>📍 {s.location_note}</p>}

      {s.status === "scheduled" && (
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ color: "#94a3b8", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>Skill Transfer % when complete</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input type="range" min={0} max={100} value={transfer} onChange={e => setTransfer(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ color: "#10b981", fontWeight: 600, fontSize: "0.85rem", minWidth: "40px" }}>{transfer}%</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={() => onNote(s.id)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#334155", color: "#94a3b8", border: "none", borderRadius: "7px", padding: "6px 12px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500 }}>
          <FileText size={12} /> Notes
        </button>
        {s.status === "scheduled" && (
          <button onClick={() => onMarkComplete(s.id, transfer)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#10b98120", color: "#10b981", border: "1px solid #10b98130", borderRadius: "7px", padding: "6px 12px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
            <CheckCheck size={12} /> Mark Complete
          </button>
        )}
        {s.status === "completed" && (!s.reviews || s.reviews.length < 2) && (
          <button onClick={() => onReview(s)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b30", borderRadius: "7px", padding: "6px 12px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
            <Star size={12} /> Rate Session
          </button>
        )}
      </div>

      {s.skill_transfer_percent > 0 && s.status === "completed" && (
        <div style={{ marginTop: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Skill Transfer</span>
            <span style={{ color: "#10b981", fontSize: "0.72rem", fontWeight: 600 }}>{s.skill_transfer_percent}%</span>
          </div>
          <div style={{ height: "5px", background: "#334155", borderRadius: "3px" }}>
            <div style={{ height: "100%", width: `${s.skill_transfer_percent}%`, background: "linear-gradient(90deg, #6366f1, #10b981)", borderRadius: "3px" }} />
          </div>
        </div>
      )}
      {s.notes && <p style={{ color: "#64748b", fontSize: "0.78rem", margin: "0.75rem 0 0", fontStyle: "italic", padding: "8px", background: "#0f172a", borderRadius: "6px" }}>📝 {s.notes}</p>}
    </div>
  );
};

export default SessionsPage;
