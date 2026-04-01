import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Repeat2, LogOut, LayoutDashboard, Shield, BookOpen, Users } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const isActive = (path: string) => loc.pathname === path;

  const linkStyle = (path: string): React.CSSProperties => ({
    color: isActive(path) ? "#6366f1" : "#94a3b8",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: isActive(path) ? 600 : 400,
    padding: "4px 0",
    borderBottom: isActive(path) ? "2px solid #6366f1" : "2px solid transparent",
    transition: "all 0.2s",
  });

  return (
    <nav style={{ background: "#0f172a", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100 }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <Repeat2 size={22} color="#6366f1" />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.5px" }}>SkillSwap</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/skills" style={linkStyle("/skills")}>Browse</Link>
        <Link to="/about" style={linkStyle("/about")}>About</Link>
        {user && !isAdmin && (
          <>
            <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
            <Link to="/swaps" style={linkStyle("/swaps")}>My Swaps</Link>
            <Link to="/sessions" style={linkStyle("/sessions")}>Sessions</Link>
          </>
        )}
        {isAdmin && (
          <Link to="/admin" style={{ ...linkStyle("/admin"), color: "#f59e0b" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Shield size={14} /> Admin
            </span>
          </Link>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: isAdmin ? "#f59e0b22" : "#6366f122", display: "flex", alignItems: "center", justifyContent: "center", color: isAdmin ? "#f59e0b" : "#6366f1", fontWeight: 700, fontSize: "0.85rem", border: `2px solid ${isAdmin ? "#f59e0b44" : "#6366f144"}` }}>
                {user.name[0].toUpperCase()}
              </div>
              <span style={{ color: "#e2e8f0", fontSize: "0.875rem", fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
            </div>
            <button onClick={() => { logout(); navigate("/"); }} style={{ background: "transparent", border: "1px solid #334155", borderRadius: "8px", padding: "6px 12px", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem" }}>
              <LogOut size={13} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem" }}>Login</Link>
            <Link to="/register" style={{ background: "#6366f1", color: "#fff", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 600 }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
