export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  role: "user" | "admin";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Skill {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  type: "offer" | "want";
  level: "beginner" | "intermediate" | "expert";
  is_active: boolean;
  created_at: Date;
}

export interface SwapRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_skill_id: string;
  receiver_skill_id: string;
  message?: string;
  preferred_mode: "online" | "offline" | "both";
  status: "pending" | "accepted" | "rejected" | "completed";
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  swap_id: string;
  teacher_id: string;
  learner_id: string;
  scheduled_at: Date;
  duration_minutes: number;
  mode: "video" | "audio" | "chat" | "offline";
  meet_link?: string;
  location_note?: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  notes?: string;
  skill_transfer_percent: number;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  swap_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: Date;
}

export interface Review {
  id: string;
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  skill_transfer_percent: number;
  created_at: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  is_active: boolean;
  created_at: Date;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}

// ---- Request Body Types ----
export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  bio?: string;
  location?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateSkillBody {
  title: string;
  description: string;
  category: string;
  type: "offer" | "want";
  level: "beginner" | "intermediate" | "expert";
}

export interface CreateSwapBody {
  receiver_id: string;
  sender_skill_id: string;
  receiver_skill_id: string;
  message?: string;
  preferred_mode: "online" | "offline" | "both";
}

export interface CreateSessionBody {
  swap_id: string;
  scheduled_at: string;
  duration_minutes: number;
  mode: "video" | "audio" | "chat" | "offline";
  meet_link?: string;
  location_note?: string;
}

export interface UpdateSessionBody {
  notes?: string;
  skill_transfer_percent?: number;
  status?: "ongoing" | "completed" | "cancelled";
}

export interface CreateReviewBody {
  session_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  skill_transfer_percent: number;
}

export interface SendMessageBody {
  swap_id: string;
  content: string;
}

export interface CreateCategoryBody {
  name: string;
  icon?: string;
}
