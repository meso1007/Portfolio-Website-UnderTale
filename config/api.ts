// API Configuration
export const API_BASE_URL = import.meta.env.MODE === 'production'
    ? 'https://undertale-api.fly.dev/api/save'
    : 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
    GUESTBOOK: `${API_BASE_URL}/api/guestbook`,
    PROJECTS: `${API_BASE_URL}/api/projects`,
    HEALTH: `${API_BASE_URL}/health`,
} as const;
