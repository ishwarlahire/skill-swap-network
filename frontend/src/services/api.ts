import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ssn_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (d: object) => api.post("/auth/register", d);
export const login = (d: object) => api.post("/auth/login", d);
export const getMe = () => api.get("/auth/me");
export const getUserProfile = (id: string) => api.get(`/users/${id}`);

// Skills
export const getAllSkills = (p?: object) => api.get("/skills", { params: p });
export const getMySkills = () => api.get("/skills/my");
export const createSkill = (d: object) => api.post("/skills", d);
export const deleteSkill = (id: string) => api.delete(`/skills/${id}`);

// Categories
export const getCategories = () => api.get("/categories");

// Swaps
export const createSwap = (d: object) => api.post("/swaps", d);
export const getMySwaps = () => api.get("/swaps/my");
export const getSwapById = (id: string) => api.get(`/swaps/${id}`);
export const updateSwapStatus = (id: string, status: string) => api.patch(`/swaps/${id}/status`, { status });

// Sessions
export const createSession = (d: object) => api.post("/sessions", d);
export const getMySessions = () => api.get("/sessions/my");
export const getSessionsBySwap = (swapId: string) => api.get(`/sessions/swap/${swapId}`);
export const updateSession = (id: string, d: object) => api.patch(`/sessions/${id}`, d);

// Messages
export const sendMessage = (d: object) => api.post("/messages", d);
export const getMessages = (swapId: string) => api.get(`/messages/${swapId}`);

// Reviews
export const createReview = (d: object) => api.post("/reviews", d);
export const getMyReviews = () => api.get("/reviews/my");

// Admin
export const adminGetStats = () => api.get("/admin/stats");
export const adminGetUsers = () => api.get("/admin/users");
export const adminToggleUser = (id: string) => api.patch(`/admin/users/${id}/toggle`);
export const adminDeleteUser = (id: string) => api.delete(`/admin/users/${id}`);
export const adminGetAllSkills = () => api.get("/admin/skills");
export const adminToggleSkill = (id: string) => api.patch(`/admin/skills/${id}/toggle`);
export const adminGetCategories = () => api.get("/admin/categories");
export const adminCreateCategory = (d: object) => api.post("/admin/categories", d);
export const adminToggleCategory = (id: string) => api.patch(`/admin/categories/${id}/toggle`);
export const adminDeleteCategory = (id: string) => api.delete(`/admin/categories/${id}`);

export default api;
