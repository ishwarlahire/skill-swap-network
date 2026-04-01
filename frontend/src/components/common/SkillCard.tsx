import { Skill } from "../../types";
import { MapPin, Star, ArrowRightLeft, TrendingUp } from "lucide-react";

interface Props { skill: Skill; onSwap?: (skill: Skill) => void; }

const levelColor = { beginner: "#10b981", intermediate: "#f59e0b", expert: "#ef4444" };

const SkillCard = ({ skill, onSwap }: Props) => (
  <div style={{ background: "#1e293b", borderRadius: "12px", padding: "1.25rem", border: "1px solid #334155", transition: "all 0.2s", cursor: "default" }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#6366f1"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#334155"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>

    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
      <span style={{ background: skill.type === "offer" ? "#10b98120" : "#f59e0b20", color: skill.type === "offer" ? "#10b981" : "#f59e0b", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>
        {skill.type === "offer" ? "🎁 Offering" : "🔍 Wanting"}
      </span>
      <span style={{ color: levelColor[skill.level] || "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>
        {skill.level}
      </span>
    </div>

    <h3 style={{ color: "#f1f5f9", margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 700 }}>{skill.title}</h3>
    <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
      {skill.description.length > 90 ? skill.description.slice(0, 90) + "..." : skill.description}
    </p>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#334155", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: 700, fontSize: "0.72rem" }}>
          {skill.user_name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ color: "#cbd5e1", fontSize: "0.8rem", fontWeight: 500 }}>{skill.user_name}</div>
          {skill.location && <div style={{ display: "flex", alignItems: "center", gap: "2px" }}><MapPin size={10} color="#64748b" /><span style={{ color: "#64748b", fontSize: "0.72rem" }}>{skill.location}</span></div>}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "3px", justifyContent: "flex-end" }}>
          <Star size={11} color="#f59e0b" fill="#f59e0b" />
          <span style={{ color: "#f59e0b", fontSize: "0.78rem", fontWeight: 600 }}>{Number(skill.avg_rating || 0).toFixed(1)}</span>
          <span style={{ color: "#475569", fontSize: "0.72rem" }}>({skill.review_count || 0})</span>
        </div>
        {(skill.avg_transfer_percent || 0) > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: "flex-end" }}>
            <TrendingUp size={10} color="#10b981" />
            <span style={{ color: "#10b981", fontSize: "0.72rem" }}>{Number(skill.avg_transfer_percent).toFixed(0)}% transfer</span>
          </div>
        )}
      </div>
    </div>

    <span style={{ background: "#334155", color: "#94a3b8", fontSize: "0.7rem", padding: "3px 8px", borderRadius: "20px" }}>{skill.category}</span>

    {onSwap && skill.type === "offer" && (
      <button onClick={() => onSwap(skill)} style={{ width: "100%", marginTop: "0.75rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        <ArrowRightLeft size={13} /> Request Swap
      </button>
    )}
  </div>
);

export default SkillCard;
