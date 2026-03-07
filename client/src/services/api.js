import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  timeout: 60000, // 60s — PDF processing can be slow
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Upload 3 PDFs + metadata
export const uploadPDFs = (formData, onProgress) =>
  api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });

export const getUploadHistory = () => api.get("/upload/history");
export const deletePaper = (id) => api.delete(`/upload/${id}`);

export const runAnalysis = (paperId) => api.post(`/analysis/run/${paperId}`);
export const getAnalysisStatus = (paperId) => api.get(`/analysis/status/${paperId}`);
export const getResults = (paperId) => api.get(`/analysis/results/${paperId}`);
export const comparePapers = (ids) => api.get(`/analysis/compare?ids=${ids.join(",")}`);

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// Visitor tracking
export const startVisit = (userId = null) => api.post("/admin/visit/start", { userId });
export const endVisit = (visitId) => api.post("/admin/visit/end", { visitId });

// Admin
export const getAdminStats = () => api.get("/admin/stats");

export const queryAgent = (message, paperId) =>
  api.post("/agent/query", { message, paperId });

export default api;