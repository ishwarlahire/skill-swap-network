import { useEffect, useState } from "react";
import { adminGetStats, adminGetUsers, adminToggleUser, adminDeleteUser, adminGetAllSkills, adminToggleSkill, adminGetCategories, adminCreateCategory, adminToggleCategory, adminDeleteCategory } from "../services/api";
import toast from "react-hot-toast";
import { Users, Layers, Tag, BarChart2, Trash2, ToggleLeft, ToggleRight, Plus, X, Shield } from "lucide-react";

const AdminPage = () => {
  const [tab, setTab] = useState<"stats" | "users" | "skills" | "categories">("stats");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCat, setNewCat] = useState({ name: "", icon: "🎯" });
  const [showCatForm, setShowCatForm] = useState(false);

  useEffect(() => {
    adminGetStats().then(r => setStats(r.data.data));
  }, []);

  useEffect(() => {
    if (tab === "users") adminGetUsers().then(r => setUsers(r.data.data));
    if (tab === "skills") adminGetAllSkills().then(r => setSkills(r.data.data));
    if (tab === "categories") adminGetCategories().then(r => setCategories(r.data.data));
  }, [tab]);

  const handleToggleUser = async (id: string) => {
    await adminToggleUser(id);
    adminGetUsers().then(r => setUsers(r.data.data));
    toast.success("User status updated");
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try { await adminDeleteUser(id); setUsers(users.filter(u => u.id !== id)); toast.success("User deleted"); }
    catch { toast.error("Cannot delete admin"); }
  };

  const handleToggleSkill = async (id: string) => {
    await adminToggleSkill(id);
    adminGetAllSkills().then(r => setSkills(r.data.data));
  };

  const handleCreateCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateCategory(newCat);
      toast.success("Category added!");
      setShowCatForm(false);
      setNewCat({ name: "", icon: "🎯" });
      adminGetCategories().then(r => setCategories(r.data.data));
    } catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const handleToggleCat = async (id: string) => {
    await adminToggleCategory(id);
    adminGetCategories().then(r => setCategories(r.data.data));
  };

  const handleDeleteCat = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    await adminDeleteCategory(id);
    setCategories(categories.filter(c => c.id !== id));
    toast.success("Category deleted");
  };

  const tabs = [
    { key: "stats", label: "Stats", icon: <BarChart2 size={15} /> },
    { key: "users", label: "Users", icon: <Users size={15} /> },
    { key: "skills", label: "Skills", icon: <Layers size={15} /> },
    { key: "categories", label: "Categories", icon: <Tag size={15} /> },
  ];

  const inputStyle: React.CSSProperties = { background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "8px 12px", color: "#f1f5f9", fontSize: "0.875rem", outline: "none", fontFamily: "Inter, sans-serif" };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
          <Shield size={22} color="#f59e0b" />
          <div>
            <h1 style={{ color: "#f1f5f9", margin: 0, fontWeight: 700, fontSize: "1.4rem" }}>Super Admin Panel</h1>
            <p style={{ color: "#64748b", margin: 0, fontSize: "0.82rem" }}>Manage users, skills, and platform settings</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", background: "#1e293b", padding: "6px", borderRadius: "10px", width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: tab === t.key ? "#0f172a" : "transparent", color: tab === t.key ? "#f1f5f9" : "#64748b", border: "none", borderRadius: "7px", cursor: "pointer", fontWeight: tab === t.key ? 600 : 400, fontSize: "0.85rem", transition: "all 0.15s" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === "stats" && stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Total Users", value: stats.users, color: "#6366f1" },
              { label: "Total Skills", value: stats.skills, color: "#10b981" },
              { label: "Total Swaps", value: stats.swaps, color: "#f59e0b" },
              { label: "Total Sessions", value: stats.sessions, color: "#ec4899" },
              { label: "Total Reviews", value: stats.reviews, color: "#8b5cf6" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: "12px", padding: "1.5rem", border: "1px solid #334155", textAlign: "center" }}>
                <div style={{ color: s.color, fontWeight: 800, fontSize: "2.5rem", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ color: "#64748b", fontSize: "0.82rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div>
            <h2 style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "1rem" }}>All Users ({users.length})</h2>
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155" }}>
                    {["Name", "Email", "Role", "Skills", "Swaps", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.role === "admin" ? "#f59e0b20" : "#6366f120", display: "flex", alignItems: "center", justifyContent: "center", color: u.role === "admin" ? "#f59e0b" : "#6366f1", fontWeight: 700, fontSize: "0.75rem" }}>{u.name[0]}</div>
                          <span style={{ color: "#f1f5f9", fontSize: "0.875rem", fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "0.82rem" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: u.role === "admin" ? "#f59e0b20" : "#334155", color: u.role === "admin" ? "#f59e0b" : "#94a3b8", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>{u.role}</span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "0.82rem" }}>{u.skill_count}</td>
                      <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "0.82rem" }}>{u.swap_count}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: u.is_active ? "#10b98120" : "#ef444420", color: u.is_active ? "#10b981" : "#ef4444", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>{u.is_active ? "Active" : "Inactive"}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {u.role !== "admin" && (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => handleToggleUser(u.id)} title={u.is_active ? "Deactivate" : "Activate"} style={{ background: "#334155", border: "none", borderRadius: "6px", padding: "5px", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                              {u.is_active ? <ToggleRight size={15} color="#10b981" /> : <ToggleLeft size={15} />}
                            </button>
                            <button onClick={() => handleDeleteUser(u.id, u.name)} title="Delete user" style={{ background: "#ef444415", border: "none", borderRadius: "6px", padding: "5px", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {tab === "skills" && (
          <div>
            <h2 style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "1rem" }}>All Skills ({skills.length})</h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {skills.map(s => (
                <div key={s.id} style={{ background: "#1e293b", borderRadius: "10px", padding: "1rem 1.25rem", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "3px" }}>
                      <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem" }}>{s.title}</span>
                      <span style={{ background: s.type === "offer" ? "#10b98120" : "#f59e0b20", color: s.type === "offer" ? "#10b981" : "#f59e0b", fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>{s.type}</span>
                      {!s.is_active && <span style={{ background: "#ef444420", color: "#ef4444", fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>Hidden</span>}
                    </div>
                    <span style={{ color: "#64748b", fontSize: "0.78rem" }}>by {s.user_name} · {s.category} · {s.level}</span>
                  </div>
                  <button onClick={() => handleToggleSkill(s.id)} style={{ background: s.is_active ? "#ef444415" : "#10b98115", color: s.is_active ? "#ef4444" : "#10b981", border: "none", borderRadius: "7px", padding: "6px 12px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
                    {s.is_active ? "Hide" : "Show"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {tab === "categories" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", margin: 0 }}>Categories ({categories.length})</h2>
              <button onClick={() => setShowCatForm(true)} style={{ display: "flex", alignItems: "center", gap: "5px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                <Plus size={13} /> Add Category
              </button>
            </div>

            {showCatForm && (
              <form onSubmit={handleCreateCat} style={{ background: "#1e293b", borderRadius: "10px", padding: "1.25rem", border: "1px solid #334155", marginBottom: "1rem", display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                <div>
                  <label style={{ color: "#94a3b8", fontSize: "0.78rem", display: "block", marginBottom: "4px" }}>Icon</label>
                  <input value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} style={{ ...inputStyle, width: "60px" }} maxLength={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "#94a3b8", fontSize: "0.78rem", display: "block", marginBottom: "4px" }}>Category Name</label>
                  <input value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} required placeholder="e.g. Robotics" style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} />
                </div>
                <button type="submit" style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>Add</button>
                <button type="button" onClick={() => setShowCatForm(false)} style={{ background: "transparent", color: "#64748b", border: "1px solid #334155", borderRadius: "8px", padding: "8px", cursor: "pointer", display: "flex" }}><X size={15} /></button>
              </form>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {categories.map(c => (
                <div key={c.id} style={{ background: "#1e293b", borderRadius: "10px", padding: "1rem", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.4rem" }}>{c.icon}</span>
                    <div>
                      <p style={{ color: "#f1f5f9", margin: 0, fontWeight: 600, fontSize: "0.875rem" }}>{c.name}</p>
                      <span style={{ background: c.is_active ? "#10b98115" : "#ef444415", color: c.is_active ? "#10b981" : "#ef4444", fontSize: "0.68rem", fontWeight: 600, padding: "1px 7px", borderRadius: "20px" }}>{c.is_active ? "Active" : "Hidden"}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleToggleCat(c.id)} style={{ background: "#334155", border: "none", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>
                      {c.is_active ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => handleDeleteCat(c.id, c.name)} style={{ background: "#ef444415", border: "none", borderRadius: "6px", padding: "5px", cursor: "pointer", color: "#ef4444", display: "flex" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
