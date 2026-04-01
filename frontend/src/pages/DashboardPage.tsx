import { useEffect, useState } from "react";
import { getMySkills, getCategories, createSkill, deleteSkill, getMyReviews, getUserProfile } from "../services/api";
import { Skill, Category, Review } from "../types";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Plus, X, Star, TrendingUp, Repeat2, BookOpen } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", type: "offer" as "offer" | "want", level: "beginner" as const });

  const load = async () => {
    const [sr, cr, rr, pr] = await Promise.all([getMySkills(), getCategories(), getMyReviews(), getUserProfile(user!.id)]);
    setSkills(sr.data.data);
    setCategories(cr.data.data);
    setReviews(rr.data.data);
    setStats(pr.data.data);
    if (cr.data.data.length > 0) setForm(f => ({ ...f, category: cr.data.data[0].name }));
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSkill(form);
      toast.success("Skill added! 🎉");
      setShowModal(false);
      load();
    } catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteSkill(id); toast.success("Removed"); setSkills(skills.filter(s => s.id !== id)); }
    catch { toast.error("Failed to delete"); }
  };

  const offering = skills.filter(s => s.type === "offer");
  const wanting = skills.filter(s => s.type === "want");

  const inputStyle: React.CSSProperties = { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#f1f5f9", fontSize: "0.875rem", boxSizing: "border-box", outline: "none", fontFamily: "Inter, sans-serif" };
  const labelStyle: React.CSSProperties = { color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "6px", fontWeight: 500 };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ color: "#f1f5f9", margin: 0, fontWeight: 700 }}>My Dashboard</h1>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "0.875rem" }}>Welcome back, {user?.name} 👋</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", fontSize: "0.875rem" }}>
            <Plus size={15} /> Add Skill
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { icon: <Repeat2 size={16} color="#6366f1" />, label: "Skills Offering", value: offering.length, color: "#6366f1" },
            { icon: <BookOpen size={16} color="#10b981" />, label: "Skills Wanting", value: wanting.length, color: "#10b981" },
            { icon: <Star size={16} color="#f59e0b" />, label: "Avg Rating", value: Number(stats?.avg_rating || 0).toFixed(1), color: "#f59e0b" },
            { icon: <TrendingUp size={16} color="#ec4899" />, label: "Avg Transfer %", value: `${Number(stats?.avg_transfer_percent || 0).toFixed(0)}%`, color: "#ec4899" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: "12px", padding: "1.25rem", border: "1px solid #334155" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <div style={{ background: s.color + "20", padding: "6px", borderRadius: "6px" }}>{s.icon}</div>
                <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{s.label}</span>
              </div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: "1.5rem" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        {[{ label: "🎁 Skills I'm Offering", list: offering }, { label: "🔍 Skills I Want to Learn", list: wanting }].map(({ label, list }) => (
          <div key={label} style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label} ({list.length})</h2>
            {list.length === 0
              ? <div style={{ background: "#1e293b", borderRadius: "10px", padding: "2rem", textAlign: "center", border: "1px dashed #334155" }}>
                  <p style={{ color: "#475569", margin: 0, fontSize: "0.875rem" }}>No skills yet. Click "Add Skill" to add one.</p>
                </div>
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
                  {list.map(skill => (
                    <div key={skill.id} style={{ background: "#1e293b", borderRadius: "10px", padding: "1rem", border: "1px solid #334155", position: "relative" }}>
                      <div style={{ paddingRight: "2rem" }}>
                        <p style={{ color: "#f1f5f9", fontWeight: 700, margin: "0 0 4px", fontSize: "0.9rem" }}>{skill.title}</p>
                        <p style={{ color: "#64748b", margin: "0 0 6px", fontSize: "0.78rem" }}>{skill.description.slice(0, 80)}...</p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <span style={{ background: "#334155", color: "#94a3b8", fontSize: "0.7rem", padding: "2px 8px", borderRadius: "20px" }}>{skill.category}</span>
                          <span style={{ background: "#334155", color: "#94a3b8", fontSize: "0.7rem", padding: "2px 8px", borderRadius: "20px" }}>{skill.level}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(skill.id)} style={{ position: "absolute", top: "10px", right: "10px", background: "#ef444415", border: "none", borderRadius: "6px", padding: "4px", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
            }
          </div>
        ))}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h2 style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>⭐ My Reviews ({reviews.length})</h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: "#1e293b", borderRadius: "10px", padding: "1rem", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.875rem" }}>{r.reviewer_name}</span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1,2,3,4,5].map(n => <Star key={n} size={13} color={n <= r.rating ? "#f59e0b" : "#334155"} fill={n <= r.rating ? "#f59e0b" : "none"} />)}
                      <span style={{ color: "#64748b", fontSize: "0.75rem", marginLeft: "6px" }}>• {r.skill_transfer_percent}% transfer</span>
                    </div>
                  </div>
                  {r.comment && <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.82rem", fontStyle: "italic" }}>"{r.comment}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "480px", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#f1f5f9", margin: 0, fontWeight: 700 }}>Add New Skill</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Skill Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. React Development" style={inputStyle} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="What can you teach or what do you want to learn?" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              {[
                { key: "category", label: "Category", options: categories.map(c => c.name) },
                { key: "type", label: "Type", options: ["offer", "want"] },
                { key: "level", label: "Level", options: ["beginner", "intermediate", "expert"] },
              ].map(({ key, label, options }) => (
                <div key={key} style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>{label}</label>
                  <select value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                    {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                  </select>
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", cursor: "pointer", fontWeight: 600, marginTop: "0.5rem" }}>
                {loading ? "Adding..." : "Add Skill"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
