import { Link } from "react-router-dom";
import { Repeat2, ArrowRight, Star, Shield, Video, MessageSquare, Calendar, TrendingUp } from "lucide-react";

const steps = [
  { num: "01", icon: <Repeat2 size={20} color="#6366f1" />, title: "List Your Skill", desc: "Add what you can teach and what you want to learn. No money involved — just skills." },
  { num: "02", icon: <ArrowRight size={20} color="#10b981" />, title: "Send a Swap Request", desc: "Find someone with the skill you want and propose a swap with your skill." },
  { num: "03", icon: <Calendar size={20} color="#f59e0b" />, title: "Schedule a Session", desc: "Accept the swap, pick a date & time, choose online (video/audio/chat) or offline mode." },
  { num: "04", icon: <TrendingUp size={20} color="#ec4899" />, title: "Learn & Rate", desc: "Complete your session, track skill transfer %, and leave a review for each other." },
];

const features = [
  { icon: <Video size={18} color="#6366f1" />, title: "Video & Audio Calls", desc: "Share Google Meet or Zoom links directly in the app" },
  { icon: <MessageSquare size={18} color="#10b981" />, title: "In-app Chat", desc: "Message your swap partner before and during sessions" },
  { icon: <Calendar size={18} color="#f59e0b" />, title: "Session Scheduling", desc: "Book sessions with date, time and duration planning" },
  { icon: <TrendingUp size={18} color="#ec4899" />, title: "Skill Transfer Tracker", desc: "Track how much of the skill has been transferred (0–100%)" },
  { icon: <Star size={18} color="#f97316" />, title: "Rating System", desc: "Rate each other after every session — build your reputation" },
  { icon: <Shield size={18} color="#8b5cf6" />, title: "Admin Moderation", desc: "Platform moderated by super admin for quality & safety" },
];

const HomePage = () => (
  <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "Inter, sans-serif" }}>

    {/* Hero */}
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 2rem 4rem", textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#6366f115", color: "#6366f1", padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem", border: "1px solid #6366f130" }}>
        <Repeat2 size={13} /> No money. Just skills.
      </div>
      <h1 style={{ color: "#f8fafc", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, margin: "0 0 1.25rem", lineHeight: 1.15, letterSpacing: "-1px" }}>
        Teach what you know.<br />
        <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learn what you want.</span>
      </h1>
      <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: "540px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
        SkillSwap connects people who want to exchange skills — no money needed. I'll teach you React if you teach me Guitar.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/register" style={{ background: "#6366f1", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
          Start Swapping Free <ArrowRight size={16} />
        </Link>
        <Link to="/skills" style={{ background: "transparent", color: "#94a3b8", textDecoration: "none", padding: "14px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "1rem", border: "1px solid #334155" }}>
          Browse Skills
        </Link>
      </div>
    </div>

    {/* How it works */}
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2rem 4rem" }}>
      <h2 style={{ color: "#f1f5f9", textAlign: "center", fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>How SkillSwap Works</h2>
      <p style={{ color: "#64748b", textAlign: "center", marginBottom: "2.5rem" }}>4 simple steps to start learning and teaching</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
        {steps.map((s) => (
          <div key={s.num} style={{ background: "#1e293b", borderRadius: "14px", padding: "1.5rem", border: "1px solid #334155", position: "relative" }}>
            <div style={{ position: "absolute", top: "1rem", right: "1rem", color: "#1e3a5f", fontSize: "1.8rem", fontWeight: 800 }}>{s.num}</div>
            <div style={{ background: "#0f172a", borderRadius: "10px", padding: "10px", display: "inline-flex", marginBottom: "1rem" }}>{s.icon}</div>
            <h3 style={{ color: "#f1f5f9", margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: 700 }}>{s.title}</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: "0.85rem", lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Features */}
    <div style={{ background: "#0a0f1e", padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ color: "#f1f5f9", textAlign: "center", fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>Everything you need</h2>
        <p style={{ color: "#64748b", textAlign: "center", marginBottom: "2.5rem" }}>Built for real skill exchange, not just chat</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: "12px", padding: "1.25rem", border: "1px solid #334155", display: "flex", gap: "1rem" }}>
              <div style={{ background: "#0f172a", borderRadius: "8px", padding: "10px", height: "fit-content", flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h4 style={{ color: "#f1f5f9", margin: "0 0 4px", fontSize: "0.9rem", fontWeight: 700 }}>{f.title}</h4>
                <p style={{ color: "#64748b", margin: 0, fontSize: "0.82rem", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h2 style={{ color: "#f1f5f9", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>Ready to start swapping?</h2>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>Join thousands of learners and teachers</p>
      <Link to="/register" style={{ background: "#6366f1", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: "10px", fontWeight: 700, fontSize: "1rem" }}>
        Create Free Account →
      </Link>
    </div>
  </div>
);

export default HomePage;
