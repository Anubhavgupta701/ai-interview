// In dev: VITE_SERVER_URL is empty → Vite proxy forwards /api to localhost:8000
// In production: VITE_SERVER_URL points to the deployed Render backend
export const serverUrl = import.meta.env.VITE_SERVER_URL || "";
