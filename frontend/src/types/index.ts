export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
  avg_rating?: number;
  review_count?: number;
  avg_transfer_percent?: number;
}

export interface Skill {
  id: string;
  user_id: string;
  user_name?: string;
  location?: string;
  avg_rating?: number;
  review_count?: number;
  avg_transfer_percent?: number;
  title: string;
  description: string;
  category: string;
  type: "offer" | "want";
  level: "beginner" | "intermediate" | "expert";
  is_active: boolean;
  created_at: string;
}

export interface SwapRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_name: string;
  receiver_name: string;
  sender_avatar?: string;
  receiver_avatar?: string;
  sender_skill_title: string;
  sender_skill_category: string;
  receiver_skill_title: string;
  receiver_skill_category: string;
  message?: string;
  preferred_mode: "online" | "offline" | "both";
  status: "pending" | "accepted" | "rejected" | "completed";
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  swap_id: string;
  teacher_id: string;
  learner_id: string;
  teacher_name: string;
  learner_name: string;
  scheduled_at: string;
  duration_minutes: number;
  mode: "video" | "audio" | "chat" | "offline";
  meet_link?: string;
  location_note?: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  notes?: string;
  skill_transfer_percent: number;
  sender_skill_title?: string;
  receiver_skill_title?: string;
  reviews?: Review[];
  created_at: string;
}

export interface Message {
  id: string;
  swap_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  session_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  skill_transfer_percent: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  is_active: boolean;
}
