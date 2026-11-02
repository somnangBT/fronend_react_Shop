// Base API URL: Uses environment variable if set, otherwise defaults to Vercel production backend
export const API_BASE_URL = process.env.REACT_APP_API_URL || "https://backend-laravel-shop.vercel.app";

export default API_BASE_URL;
