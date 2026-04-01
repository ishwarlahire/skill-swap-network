import { useEffect, useState } from "react";
import { getAllSkills, getCategories, getMySkills, createSwap } from "../services/api";
import { Skill, Category } from "../types";
import SkillCard from "../components/common/SkillCard";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Search, X } from "lucide-react";

const BrowseSkillsPage = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [swapTarget, setSwapTarget] = useState<Skill | null>(null);
  const [swapForm, setSwapForm] = useState({ sender_skill_id: "", message: "", preferred_mode: "both" as const });
  const [swapLoading, setSwapLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllSkills(),
      getCategories(),
      user ? getMySkills() : Promise.resolve(null),
    ]).then(([sr, cr, msr]) => {
      setSkills(sr.data.data);
      setCategories(cr.data.data);
      if (msr) setMySkills(msr.data.data.filter((s: Skill) => s.type === "offer"));
    }).finally(() => setLoading(false));
  }, []);

  const fetchSkills = async () => {
    const params: any = {};
    if (category !== "All") params.category = category;
    if (type !== "All") params.type = type;
    if (search) params.search = search;
    const r = await getAllSkills(params);
    setSkills(r.data.data);
  };

  useEffect(() => { fetchSkills(); }, [category, type]);

  const handleSwapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapTarget || !user) return;
    if (!swapForm.sender_skill_id) { toast.error("Select the skill you're offering!"); return; }
    setSwapLoading(true);
    try {
      await createSwap({ receiver_id: swapTarget.user_id, sender_skill_id: swapForm.sender_skill_id, receiver_skill_id: swapTarget.id, message: swapForm.message, preferred_mode: swapForm.preferred_mode });
      toast.success("Swap request sent! 🚀");
      setSwapTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send request");
    } finally { setSwapLoading(false); }
  };

  const filtered = skills.filter(s => s.user_id !== user?.id);

  const inputStyle: React.CSSProperties = { background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#f1f5f9", fontSize: "0.875rem", outline: "none", fontFamily: "Inter, sans-serif" };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#f1f5f9", marginBottom: "0.5rem", fontWeight: 700 }}>Browse Skills</h1>
        <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.9rem" }}>Find skills to learn and people to swap with</p>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={15} color="#64748b" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchSkills()} placeholder="Search skills..." style={{ ...inputStyle, paddingLeft: "32px", width: "100%", boxSizing: "border-box" }} />
          </div>
          <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {["All", "offer", "want"].map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t === "offer" ? "🎁 Offering" : "🔍 Wanting"}</option>)}
          </select>
          <button onClick={fetchSkills} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>Search</button>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {["All", ...categories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ background: category === cat ? "#6366f1" : "#1e293b", color: category === cat ? "#fff" : "#94a3b8", border: `1px solid ${category === cat ? "#6366f1" : "#334155"}`, borderRadius: "20px", padding: "5px 14px", cursor: "pointer", fontSize: "0.8rem", fontWeight: category === cat ? 600 : 400 }}>{cat}</button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: "center", color: "#64748b", padding: "4rem" }}>Loading skills...</div>
          : filtered.length === 0 ? <div style={{ textAlign: "center", color: "#64748b", padding: "4rem" }}>No skills found.</div>
          : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
              {filtered.map(s => <SkillCard key={s.id} skill={s} onSwap={user ? setSwapTarget : undefined} />)}
            </div>
        }
      </div>

      {/* Swap Request Modal */}
      {swapTarget && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "500px", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#f1f5f9", margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Request Skill Swap</h2>
              <button onClick={() => setSwapTarget(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ background: "#0f172a", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#64748b", fontSize: "0.78rem", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase" }}>You want to learn</p>
              <p style={{ color: "#6366f1", fontWeight: 700, margin: 0 }}>{swapTarget.title}</p>
              <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "2px 0 0" }}>from {swapTarget.user_name}</p>
            </div>

            <form onSubmit={handleSwapSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "6px", fontWeight: 500 }}>What skill do you offer in return? *</label>
                {mySkills.length === 0
                  ? <p style={{ color: "#ef4444", fontSize: "0.82rem" }}>⚠️ You have no offering skills. Add skills in Dashboard first.</p>
                  : <select value={swapForm.sender_skill_id} onChange={e => setSwapForm({ ...swapForm, sender_skill_id: e.target.value })} required style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#f1f5f9", fontSize: "0.875rem", outline: "none", cursor: "pointer" }}>
                      <option value="">-- Select your skill --</option>
                      {mySkills.map(s => <option key={s.id} value={s.id}>{s.title} ({s.category})</option>)}
                    </select>
                }
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "6px", fontWeight: 500 }}>Preferred Mode</label>
                <select value={swapForm.preferred_mode} onChange={e => setSwapForm({ ...swapForm, preferred_mode: e.target.value as any })} style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#f1f5f9", fontSize: "0.875rem", outline: "none", cursor: "pointer" }}>
                  <option value="both">Both (Online & Offline)</option>
                  <option value="online">Online only (Video/Audio/Chat)</option>
                  <option value="offline">Offline only (In-person)</option>
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "6px", fontWeight: 500 }}>Message (optional)</label>
                <textarea value={swapForm.message} onChange={e => setSwapForm({ ...swapForm, message: e.target.value })} placeholder="Introduce yourself and explain what you want to learn..." rows={3} style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#f1f5f9", fontSize: "0.875rem", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }} />
              </div>

              <button type="submit" disabled={swapLoading || mySkills.length === 0} style={{ width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                {swapLoading ? "Sending..." : "Send Swap Request 🚀"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseSkillsPage;
