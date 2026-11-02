// Base API URL: Uses environment variable if set, otherwise defaults to local Laravel server
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default API_BASE_URL;
