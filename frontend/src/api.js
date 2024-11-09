import axios from "axios";

const userInfo = JSON.parse(localStorage.getItem("user-info"));
const token = userInfo?.token;

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
export const googleAuth = (code) => api.get(`/index/login/oauth?code=${code}`);
export const getAllStudents = () => api.get("/home/");
export const getStudent = (id) => api.get(`/students/${id}`);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const addStudent = (studentData) =>
  api.post(`/home/students/add`, studentData);
export const updateStudent = (studentData, id) =>
  api.patch(`/students/${id}`, studentData);
