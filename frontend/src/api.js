import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/index/login",
  // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/oauth?code=${code}`);
