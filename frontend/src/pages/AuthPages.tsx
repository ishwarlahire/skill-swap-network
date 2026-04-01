import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Repeat2 } from "lucide-react";

const inputStyle: React.CSSProperties = { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#f1f5f9", fontSize: "0.9rem", boxSizing: "border-box", outline: "none", fontFamily: "Inter, sans-serif" };
const labelStyle: React.CSSProperties = { color: "#94a3b8", fontSize: "0.82rem", display: "block", marginBottom: "6px", fontWeight: 500 };

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "420px", border: "1px solid #334155" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Repeat2 size={36} color="#6366f1" style={{ display: "block", margin: "0 auto 0.75rem" }} />
          <h1 style={{ color: "#f1f5f9", margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: "#64748b", margin: "0.5rem 0 0", fontSize: "0.85rem" }}>Login to your SkillSwap account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" style={inputStyle} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", cursor: loading ? "not-allowed" : "pointer", fontSize: "0.95rem", fontWeight: 600 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ color: "#64748b", textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem" }}>
          No account? <Link to="/register" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Welcome to SkillSwap! 🚀");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "440px", border: "1px solid #334155" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Repeat2 size={36} color="#6366f1" style={{ display: "block", margin: "0 auto 0.75rem" }} />
          <h1 style={{ color: "#f1f5f9", margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Join SkillSwap</h1>
          <p style={{ color: "#64748b", margin: "0.5rem 0 0", fontSize: "0.85rem" }}>Swap skills. Grow together. Free forever.</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Ishwar Lahire", req: true },
            { key: "email", label: "Email", type: "email", placeholder: "you@example.com", req: true },
            { key: "password", label: "Password", type: "password", placeholder: "Min 6 characters", req: true },
            { key: "location", label: "Location (optional)", type: "text", placeholder: "Mysore, Karnataka", req: false },
            { key: "bio", label: "Bio (optional)", type: "text", placeholder: "I'm a React dev who loves music...", req: false },
          ].map(({ key, label, type, placeholder, req }) => (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>{label}</label>
              <input type={type} required={req} placeholder={placeholder} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", cursor: loading ? "not-allowed" : "pointer", fontSize: "0.95rem", fontWeight: 600, marginTop: "0.5rem" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={{ color: "#64748b", textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem" }}>
          Have an account? <Link to="/login" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};
