import { useEffect, useState, useRef } from "react";
import { getMySwaps, updateSwapStatus, getMessages, sendMessage, createSession, getSessionsBySwap } from "../services/api";
import { SwapRequest, Message, Session } from "../types";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  MessageSquare, Calendar, Check, X, ArrowRightLeft,
  Send, Video, Mic, MapPin, ChevronRight, Clock, Users,
  ExternalLink, ClipboardCopy
} from "lucide-react";

type MeetMode = "video" | "audio" | "chat" | "offline";
type MeetPlatform = "google_meet" | "zoom" | "teams";

const platformInfo: Record<MeetPlatform, { label: string; color: string; url: string; placeholder: string }> = {
  google_meet: { label: "Google Meet", color: "#4285f4", url: "https://meet.google.com/new", placeholder: "https://meet.google.com/abc-defg-hij" },
  zoom:        { label: "Zoom",        color: "#2d8cff", url: "https://zoom.us/start/videomeeting", placeholder: "https://zoom.us/j/1234567890" },
  teams:       { label: "MS Teams",   color: "#6264a7", url: "https://teams.microsoft.com/",        placeholder: "https://teams.microsoft.com/l/meetup-join/..." },
};

const SwapsPage = () => {
  const { user } = useAuth();
  const [swaps, setSwaps]       = useState<SwapRequest[]>([]);
  const [selected, setSelected] = useState<SwapRequest | null>(null);
  const [tab, setTab]           = useState<"chat" | "sessions">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const msgEnd = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    title: "",
    scheduled_date: "",
    scheduled_time: "10:00",
    duration_minutes: 60,
    mode: "video" as MeetMode,
    meet_platform: "google_meet" as MeetPlatform,
    meet_link: "",
    location_note: "",
    agenda: "",
  });

  const loadSwaps = async () => {
    try { const r = await getMySwaps(); setSwaps(r.data.data); } catch {}
  };

  useEffect(() => { loadSwaps(); }, []);

  useEffect(() => {
    if (!selected) return;
    if (tab === "chat") {
      getMessages(selected.id).then(r => {
        setMessages(r.data.data);
        setTimeout(() => msgEnd.current?.scrollIntoView({ behavior: "smooth" }), 150);
      });
    } else {
      getSessionsBySwap(selected.id).then(r => setSessions(r.data.data));
    }
  }, [selected, tab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !selected) return;
    try {
      await sendMessage({ swap_id: selected.id, content: msgInput });
      setMsgInput("");
      const r = await getMessages(selected.id);
      setMessages(r.data.data);
      setTimeout(() => msgEnd.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { toast.error("Failed to send"); }
  };

  const handleStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      await updateSwapStatus(id, status);
      toast.success(`Swap ${status}!`);
      loadSwaps();
      if (selected?.id === id) setSelected(null);
    } catch { toast.error("Failed"); }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!form.scheduled_date) { toast.error("Please select a date!"); return; }
    if ((form.mode === "video" || form.mode === "audio") && !form.meet_link) {
      toast.error("Please enter the meeting link!"); return;
    }
    if (form.mode === "offline" && !form.location_note) {
      toast.error("Please enter the meetup location!"); return;
    }
    setFormLoading(true);
    try {
      await createSession({
        swap_id: selected.id,
        title: form.title || `${selected.sender_skill_title} ⇄ ${selected.receiver_skill_title}`,
        scheduled_at: `${form.scheduled_date}T${form.scheduled_time}:00`,
        duration_minutes: form.duration_minutes,
        mode: form.mode,
        meet_platform: form.meet_platform,
        meet_link: form.meet_link,
        location_note: form.location_note,
        agenda: form.agenda,
      });
      toast.success("Meeting scheduled! Details shared in chat 🎉");
      setShowForm(false);
      setForm({ title: "", scheduled_date: "", scheduled_time: "10:00", duration_minutes: 60, mode: "video", meet_platform: "google_meet", meet_link: "", location_note: "", agenda: "" });
      const [mr, sr] = await Promise.all([getMessages(selected.id), getSessionsBySwap(selected.id)]);
      setMessages(mr.data.data);
      setSessions(sr.data.data);
      setTab("chat");
      setTimeout(() => msgEnd.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to schedule");
    } finally { setFormLoading(false); }
  };

  const copyLink = (link: string) => { navigator.clipboard.writeText(link); toast.success("Copied!"); };

  const statusColor: Record<string, string> = { pending: "#f59e0b", accepted: "#10b981", rejected: "#ef4444", completed: "#6366f1" };
  const modeIcon: Record<string, JSX.Element> = {
    video: <Video size={13} color="#6366f1" />, audio: <Mic size={13} color="#10b981" />,
    chat: <MessageSquare size={13} color="#f59e0b" />, offline: <MapPin size={13} color="#ec4899" />,
  };

  const inp: React.CSSProperties = { background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "9px 12px", color: "#f1f5f9", fontSize: "0.85rem", outline: "none", fontFamily: "Inter, sans-serif", width: "100%", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { color: "#94a3b8", fontSize: "0.78rem", display: "block", marginBottom: "5px", fontWeight: 500 };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div style={{ height: "calc(100vh - 60px)", background: "#0f172a", display: "flex", fontFamily: "Inter, sans-serif" }}>

      {/* Swap List sidebar */}
      <div style={{ width: "290px", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1e293b" }}>
          <h2 style={{ color: "#f1f5f9", margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>My Swaps</h2>
          <p style={{ color: "#475569", margin: "2px 0 0", fontSize: "0.72rem" }}>{swaps.length} total</p>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {swaps.length === 0
            ? <p style={{ color: "#475569", padding: "1.5rem", fontSize: "0.82rem", lineHeight: 1.6 }}>No swaps yet.<br />Browse skills to get started!</p>
            : swaps.map(s => (
              <div key={s.id} onClick={() => { setSelected(s); setTab("chat"); }} style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid #1e293b", cursor: "pointer", background: selected?.id === s.id ? "#1e293b" : "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.82rem" }}>{s.sender_id === user?.id ? s.receiver_name : s.sender_name}</span>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {(s.unread_count || 0) > 0 && <span style={{ background: "#6366f1", color: "#fff", borderRadius: "10px", fontSize: "0.6rem", padding: "1px 5px", fontWeight: 700 }}>{s.unread_count}</span>}
                    <span style={{ background: statusColor[s.status] + "22", color: statusColor[s.status], fontSize: "0.62rem", fontWeight: 700, padding: "2px 6px", borderRadius: "20px" }}>{s.status}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ color: "#64748b", fontSize: "0.7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "95px" }}>{s.sender_skill_title}</span>
                  <ArrowRightLeft size={9} color="#475569" style={{ flexShrink: 0 }} />
                  <span style={{ color: "#64748b", fontSize: "0.7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "95px" }}>{s.receiver_skill_title}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Main Panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!selected
          ? <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", color: "#475569" }}>
              <ArrowRightLeft size={40} color="#334155" />
              <p style={{ margin: 0, fontSize: "0.875rem" }}>Select a swap to chat and schedule meetings</p>
            </div>
          : <>
              {/* Header */}
              <div style={{ padding: "0.875rem 1.5rem", borderBottom: "1px solid #1e293b", background: "#0a1022", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div>
                  <h3 style={{ color: "#f1f5f9", margin: "0 0 2px", fontSize: "0.9rem", fontWeight: 700 }}>{selected.sender_skill_title} ⇄ {selected.receiver_skill_title}</h3>
                  <span style={{ color: "#64748b", fontSize: "0.72rem" }}>with {selected.sender_id === user?.id ? selected.receiver_name : selected.sender_name} · <span style={{ color: "#94a3b8" }}>{selected.preferred_mode} mode</span></span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {selected.status === "pending" && selected.receiver_id === user?.id && (
                    <>
                      <button onClick={() => handleStatus(selected.id, "accepted")} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}><Check size={12} /> Accept</button>
                      <button onClick={() => handleStatus(selected.id, "rejected")} style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef444430", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}><X size={12} /> Reject</button>
                    </>
                  )}
                  {selected.status === "accepted" && (
                    <button onClick={() => { setShowForm(true); setTab("sessions"); }} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} /> Schedule Meeting
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #1e293b", background: "#0a1022", flexShrink: 0 }}>
                {(["chat", "sessions"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent", color: tab === t ? "#6366f1" : "#64748b", cursor: "pointer", fontWeight: tab === t ? 600 : 400, fontSize: "0.82rem" }}>
                    {t === "chat" ? "💬 Chat" : "📅 Sessions"}
                  </button>
                ))}
              </div>

              {/* Chat */}
              {tab === "chat" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {messages.length === 0
                      ? <p style={{ color: "#475569", textAlign: "center", margin: "auto", fontSize: "0.82rem" }}>No messages yet. Say hello! 👋</p>
                      : messages.map(m => {
                          const isMine = m.sender_id === user?.id;
                          const isSystem = m.content.includes("*Session Scheduled");
                          return (
                            <div key={m.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                              <div style={{ maxWidth: "78%" }}>
                                {!isMine && <p style={{ color: "#64748b", fontSize: "0.7rem", margin: "0 0 3px 4px" }}>{m.sender_name}</p>}
                                <div style={{ background: isSystem ? "#0c2444" : isMine ? "#6366f1" : "#1e293b", color: "#f1f5f9", borderRadius: isMine ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 14px", fontSize: "0.85rem", lineHeight: 1.7, border: isSystem ? "1px solid #2563eb40" : isMine ? "none" : "1px solid #334155", whiteSpace: "pre-wrap" }}>
                                  {isSystem
                                    ? m.content.split("\n").map((line, i) => {
                                        if (line.startsWith("http")) return (
                                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1e3a5f", padding: "6px 10px", borderRadius: "6px", margin: "4px 0" }}>
                                            <a href={line} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", fontSize: "0.8rem", wordBreak: "break-all", flex: 1 }}>{line}</a>
                                            <button onClick={() => copyLink(line)} style={{ background: "none", border: "none", cursor: "pointer", color: "#60a5fa", padding: 0, display: "flex" }}><ClipboardCopy size={13} /></button>
                                            <a href={line} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", display: "flex" }}><ExternalLink size={13} /></a>
                                          </div>
                                        );
                                        return <div key={i} style={{ color: line.startsWith("📅 *") ? "#93c5fd" : "#e2e8f0" }}>{line}</div>;
                                      })
                                    : m.content
                                  }
                                </div>
                                <p style={{ color: "#475569", fontSize: "0.65rem", margin: "3px 4px 0", textAlign: isMine ? "right" : "left" }}>
                                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                    }
                    <div ref={msgEnd} />
                  </div>
                  <form onSubmit={handleSend} style={{ padding: "0.875rem 1.5rem", borderTop: "1px solid #1e293b", display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                    <input value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Type a message..." style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "9px 14px", color: "#f1f5f9", fontSize: "0.875rem", outline: "none", flex: 1, fontFamily: "Inter, sans-serif" }} />
                    <button type="submit" style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600, fontSize: "0.82rem" }}>
                      <Send size={13} /> Send
                    </button>
                  </form>
                </div>
              )}

              {/* Sessions */}
              {tab === "sessions" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>

                  {/* Meeting Scheduler */}
                  {showForm && (
                    <div style={{ background: "#1e293b", borderRadius: "14px", padding: "1.5rem", border: "1px solid #334155", marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <h3 style={{ color: "#f1f5f9", margin: 0, fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                          <Calendar size={16} color="#6366f1" /> Schedule a Meeting
                        </h3>
                        <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex" }}><X size={16} /></button>
                      </div>

                      <form onSubmit={handleSchedule}>
                        {/* Title */}
                        <div style={{ marginBottom: "1rem" }}>
                          <label style={lbl}>📌 Session Title (optional)</label>
                          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={`${selected.sender_skill_title} ⇄ ${selected.receiver_skill_title}`} style={inp} />
                        </div>

                        {/* Date & Time */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                          <div>
                            <label style={lbl}>📆 Date *</label>
                            <input type="date" required min={minDate} value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} style={{ ...inp, colorScheme: "dark" }} />
                          </div>
                          <div>
                            <label style={lbl}>🕐 Time *</label>
                            <input type="time" required value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })} style={{ ...inp, colorScheme: "dark" }} />
                          </div>
                        </div>

                        {/* Duration & Mode */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                          <div>
                            <label style={lbl}>⏱️ Duration</label>
                            <select value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: Number(e.target.value) })} style={{ ...inp, cursor: "pointer" }}>
                              {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min{d >= 60 ? ` (${d/60}hr)` : ""}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={lbl}>📡 Mode</label>
                            <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value as MeetMode })} style={{ ...inp, cursor: "pointer" }}>
                              <option value="video">🎥 Video Call</option>
                              <option value="audio">🎙️ Audio Call</option>
                              <option value="chat">💬 Chat Only</option>
                              <option value="offline">🤝 In-Person</option>
                            </select>
                          </div>
                        </div>

                        {/* Online Platform & Link */}
                        {(form.mode === "video" || form.mode === "audio") && (
                          <div style={{ background: "#0f172a", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", border: "1px solid #334155" }}>
                            <p style={{ color: "#64748b", fontSize: "0.75rem", margin: "0 0 0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Choose Platform</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.875rem" }}>
                              {(Object.entries(platformInfo) as [MeetPlatform, typeof platformInfo.google_meet][]).map(([key, info]) => (
                                <button key={key} type="button" onClick={() => setForm({ ...form, meet_platform: key, meet_link: "" })} style={{ padding: "8px 6px", borderRadius: "8px", border: `2px solid ${form.meet_platform === key ? info.color : "#334155"}`, background: form.meet_platform === key ? info.color + "18" : "#1e293b", color: form.meet_platform === key ? info.color : "#64748b", cursor: "pointer", fontWeight: form.meet_platform === key ? 700 : 400, fontSize: "0.75rem" }}>
                                  {info.label}
                                </button>
                              ))}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                              <a href={platformInfo[form.meet_platform].url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#1e293b", color: "#94a3b8", textDecoration: "none", padding: "7px 12px", borderRadius: "7px", fontSize: "0.76rem", fontWeight: 600, border: "1px solid #475569" }}>
                                <ExternalLink size={12} /> Create {platformInfo[form.meet_platform].label} link
                              </a>
                              <span style={{ color: "#475569", fontSize: "0.7rem" }}>← open & paste below</span>
                            </div>

                            <div>
                              <label style={lbl}>🔗 Paste meeting link here *</label>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <input value={form.meet_link} onChange={e => setForm({ ...form, meet_link: e.target.value })} placeholder={platformInfo[form.meet_platform].placeholder} style={{ ...inp, flex: 1, width: "auto" }} />
                                {form.meet_link && (
                                  <button type="button" onClick={() => copyLink(form.meet_link)} style={{ background: "#334155", border: "none", borderRadius: "7px", padding: "8px 10px", cursor: "pointer", color: "#94a3b8", display: "flex", flexShrink: 0 }}>
                                    <ClipboardCopy size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Offline location */}
                        {form.mode === "offline" && (
                          <div style={{ marginBottom: "1rem" }}>
                            <label style={lbl}>📍 Meetup Location *</label>
                            <input value={form.location_note} onChange={e => setForm({ ...form, location_note: e.target.value })} placeholder="e.g. Cafe Coffee Day, MG Road, Mysore" style={inp} />
                          </div>
                        )}

                        {/* Agenda */}
                        <div style={{ marginBottom: "1.25rem" }}>
                          <label style={lbl}>📋 Agenda (optional)</label>
                          <textarea value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} placeholder={"e.g.\n1. Introduction\n2. React Hooks basics\n3. Practice exercise"} rows={3} style={{ ...inp, resize: "vertical" }} />
                        </div>

                        {/* Preview card */}
                        {form.scheduled_date && (
                          <div style={{ background: "#0a1022", borderRadius: "8px", padding: "0.875rem 1rem", marginBottom: "1.25rem", border: "1px solid #1e3a5f" }}>
                            <p style={{ color: "#60a5fa", fontSize: "0.75rem", fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>📋 Meeting Preview</p>
                            <div style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 2 }}>
                              <div>📆 {new Date(`${form.scheduled_date}T${form.scheduled_time}`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
                              <div>🕐 {new Date(`${form.scheduled_date}T${form.scheduled_time}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                              <div>⏱️ {form.duration_minutes} minutes</div>
                              <div>{form.mode === "video" ? "🎥" : form.mode === "audio" ? "🎙️" : form.mode === "chat" ? "💬" : "🤝"} {form.mode.charAt(0).toUpperCase() + form.mode.slice(1)} session</div>
                              {form.meet_link && <div style={{ color: "#60a5fa", wordBreak: "break-all" }}>🔗 {form.meet_link}</div>}
                              {form.location_note && <div>📍 {form.location_note}</div>}
                            </div>
                            <p style={{ color: "#475569", fontSize: "0.7rem", margin: "8px 0 0" }}>✅ These details will be auto-sent as a chat message</p>
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button type="submit" disabled={formLoading} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 22px", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={14} /> {formLoading ? "Scheduling..." : "Schedule & Share in Chat"}
                          </button>
                          <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#64748b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 18px", cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Session list */}
                  {sessions.length === 0
                    ? <div style={{ textAlign: "center", color: "#475569", padding: "3rem 1rem" }}>
                        <Calendar size={32} color="#334155" style={{ margin: "0 auto 1rem", display: "block" }} />
                        <p style={{ fontSize: "0.85rem", margin: "0 0 1rem" }}>{selected.status === "accepted" ? "No sessions yet." : "Accept the swap first."}</p>
                        {selected.status === "accepted" && <button onClick={() => setShowForm(true)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>Schedule First Meeting</button>}
                      </div>
                    : sessions.map(s => (
                      <div key={s.id} style={{ background: "#1e293b", borderRadius: "12px", padding: "1.25rem", border: "1px solid #334155", marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              {modeIcon[s.mode]}
                              <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.9rem" }}>{(s as any).title || `${s.mode} session`}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "#64748b", fontSize: "0.75rem" }}>
                                <Clock size={11} /> {new Date(s.scheduled_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at {new Date(s.scheduled_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "#64748b", fontSize: "0.75rem" }}>
                                <Users size={11} /> {s.duration_minutes}min
                              </span>
                            </div>
                          </div>
                          <span style={{ background: s.status === "completed" ? "#10b98120" : "#6366f120", color: s.status === "completed" ? "#10b981" : "#6366f1", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>{s.status}</span>
                        </div>
                        {s.meet_link && (
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                            <a href={s.meet_link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#60a5fa", fontSize: "0.78rem", textDecoration: "none", background: "#0c2444", padding: "5px 12px", borderRadius: "6px", border: "1px solid #2563eb33" }}>
                              <Video size={12} /> Join Meeting <ChevronRight size={11} />
                            </a>
                            <button onClick={() => copyLink(s.meet_link!)} style={{ background: "#334155", border: "none", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem" }}>
                              <ClipboardCopy size={11} /> Copy
                            </button>
                          </div>
                        )}
                        {s.location_note && <p style={{ color: "#94a3b8", fontSize: "0.78rem", margin: "0 0 0.5rem" }}>📍 {s.location_note}</p>}
                        {s.notes && <p style={{ color: "#64748b", fontSize: "0.78rem", margin: "0.5rem 0 0", fontStyle: "italic", background: "#0f172a", padding: "8px", borderRadius: "6px" }}>📝 {s.notes}</p>}
                        {s.skill_transfer_percent > 0 && (
                          <div style={{ marginTop: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ color: "#64748b", fontSize: "0.72rem" }}>Skill Transfer</span>
                              <span style={{ color: "#10b981", fontSize: "0.72rem", fontWeight: 700 }}>{s.skill_transfer_percent}%</span>
                            </div>
                            <div style={{ height: "5px", background: "#334155", borderRadius: "3px" }}>
                              <div style={{ height: "100%", width: `${s.skill_transfer_percent}%`, background: "linear-gradient(90deg, #6366f1, #10b981)", borderRadius: "3px" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}
            </>
        }
      </div>
    </div>
  );
};

export default SwapsPage;
