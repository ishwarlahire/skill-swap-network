import { Repeat2, Github, Linkedin, Mail, Code2, Database, Globe } from "lucide-react";

const techStack = [
  { cat: "Frontend", icon: <Globe size={16} color="#6366f1" />, items: ["React 18", "TypeScript", "React Router v6", "Axios", "Lucide Icons"] },
  { cat: "Backend", icon: <Code2 size={16} color="#10b981" />, items: ["Node.js", "Fastify", "TypeScript", "JWT Auth", "bcrypt"] },
  { cat: "Database", icon: <Database size={16} color="#f59e0b" />, items: ["PostgreSQL", "Raw SQL queries", "Connection Pooling", "Migrations"] },
];

const features = [
  "🔐 JWT Authentication with role-based access (User / Super Admin)",
  "🎯 Skill listing — offer what you know, want what you need",
  "🔄 Swap request system with accept/reject workflow",
  "📅 Session scheduling with date, time & duration",
  "🎥 Online mode: Video call, Audio call, or Chat",
  "🏠 Offline mode: In-person meetup with location notes",
  "💬 In-app real-time chat per swap",
  "📊 Skill transfer % tracker (0–100%)",
  "⭐ Rating & review system after every session",
  "👑 Super Admin panel — users, skills, categories management",
  "🏷️ Dynamic category management by admin",
  "👤 Public user profiles with stats & reviews",
];

const AboutPage = () => (
  <div style={{ minHeight: "100vh", background: "#0f172a", padding: "3rem 2rem", fontFamily: "Inter, sans-serif" }}>
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1rem" }}>
          <Repeat2 size={32} color="#6366f1" />
          <h1 style={{ color: "#f1f5f9", margin: 0, fontSize: "2rem", fontWeight: 800 }}>SkillSwap Network</h1>
        </div>
        <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto" }}>
          A platform where people exchange skills without money. Teach what you know, learn what you want — zero cost, 100% value.
        </p>
      </div>

      {/* Developer */}
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", border: "1px solid #334155", marginBottom: "2rem" }}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 1.5rem", fontSize: "1.2rem", fontWeight: 700 }}>👨‍💻 Developer</h2>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#6366f120", border: "2px solid #6366f144", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, color: "#6366f1", flexShrink: 0 }}>IL</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "#f1f5f9", margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 700 }}>Ishwar Lahire</h3>
            <p style={{ color: "#6366f1", margin: "0 0 0.75rem", fontSize: "0.85rem", fontWeight: 600 }}>Jr. Software Developer</p>
            <p style={{ color: "#94a3b8", margin: "0 0 1rem", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Backend-focused developer with hands-on experience in Node.js, TypeScript, and Fastify. Skilled in building scalable REST APIs, authentication systems, and real-time applications. Currently pursuing MCA from University of Mysore (SGPA: 9.8).
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href="https://github.com/ishwarlahire" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", textDecoration: "none", background: "#334155", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem" }}>
                <Github size={14} /> GitHub
              </a>
              <a href="https://linkedin.com/in/ishwar-lahire" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", textDecoration: "none", background: "#334155", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem" }}>
                <Linkedin size={14} /> LinkedIn
              </a>
              <a href="mailto:ishwarlahire2004@gmail.com" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", textDecoration: "none", background: "#334155", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem" }}>
                <Mail size={14} /> Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", border: "1px solid #334155", marginBottom: "2rem" }}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 0.5rem", fontSize: "1.2rem", fontWeight: 700 }}>🎯 Problem Statement</h2>
        <p style={{ color: "#94a3b8", margin: "0 0 1.5rem", lineHeight: 1.7, fontSize: "0.9rem" }}>
          People want to learn new skills but can't always afford paid courses or tutors. At the same time, many have valuable skills they'd love to share. SkillSwap bridges this gap — connecting learners and teachers through a barter-based skill exchange system.
        </p>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 1rem", fontSize: "1.2rem", fontWeight: 700 }}>✨ Key Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "0.5rem" }}>
          {features.map((f, i) => (
            <div key={i} style={{ color: "#94a3b8", fontSize: "0.85rem", padding: "8px 0", borderBottom: "1px solid #334155" }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", border: "1px solid #334155", marginBottom: "2rem" }}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 1.5rem", fontSize: "1.2rem", fontWeight: 700 }}>🛠️ Tech Stack</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {techStack.map((t) => (
            <div key={t.cat} style={{ background: "#0f172a", borderRadius: "10px", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                {t.icon}
                <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.9rem" }}>{t.cat}</span>
              </div>
              {t.items.map(item => (
                <div key={item} style={{ color: "#64748b", fontSize: "0.82rem", padding: "4px 0", borderBottom: "1px solid #1e293b" }}>• {item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div style={{ background: "#1e293b", borderRadius: "16px", padding: "2rem", border: "1px solid #334155" }}>
        <h2 style={{ color: "#f1f5f9", margin: "0 0 1.5rem", fontSize: "1.2rem", fontWeight: 700 }}>🔄 Complete Workflow</h2>
        {[
          ["Register / Login", "Create account or login. Super Admin has a default account from .env."],
          ["Add Skills", "Go to Dashboard → add skills you offer and skills you want to learn."],
          ["Browse & Request", "Browse skills → find someone offering what you want → click 'Request Swap'."],
          ["Fill Swap Request", "Specify your skill to offer in return, write a message, choose preferred mode (online/offline/both)."],
          ["Accept / Reject", "Receiver gets the request in 'My Swaps' → accepts or rejects it."],
          ["Schedule Session", "After acceptance, either person schedules a session — date, time, mode, meet link or location."],
          ["Join Session", "On session day: join via shared video/audio link, or use in-app chat, or meet in person."],
          ["Add Notes", "During/after session — add session notes to track what was covered."],
          ["Mark Complete & Rate", "Mark session as complete, set skill transfer % (how much was learned), rate each other."],
          ["Build Reputation", "Ratings and transfer % appear on your public profile for future swap partners to see."],
        ].map(([step, desc], i) => (
          <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: i < 9 ? "1px solid #334155" : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6366f120", border: "1px solid #6366f144", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: 700, fontSize: "0.78rem", flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.88rem", marginBottom: "2px" }}>{step}</div>
              <div style={{ color: "#64748b", fontSize: "0.82rem", lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);

export default AboutPage;
