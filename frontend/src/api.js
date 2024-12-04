import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const token = userInfo?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token} `;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const googleAuth = (code) => api.get(`/index/login/oauth?code=${code}`);
export const getAllStudents = () => api.get("/home/");
export const getAllArchivedStudents = () => api.get("/students/");
export const getStudent = (id) => api.get(`/students/${id}`);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const restoreStudent = (id) => api.patch(`/students/restore/${id}`);
export const unlockStudent = (id) => api.patch(`/students/unlock/${id}`);
export const addStudent = (studentData) =>
  api.post(`/home/students/add`, studentData);
export const updateStudent = (studentData, id) =>
  api.patch(`/students/${id}`, studentData);
export const getAllEnrollmentOfficers = () =>
  api.get("/dashboard/enrollment_officer");
export const addEnrollmentOfficer = (officerData) =>
  api.post("/dashboard/enrollment_officer/add", officerData);
export const updateEnrollmentOfficer = (officerData, id) =>
  api.patch(`/dashboard/enrollment_officer/${id}`, officerData);
export const deleteOfficer = (id) =>
  api.delete(`/dashboard/enrollment_officer/${id}`);
export const getDashBoard = () => api.get("/dashboard/");
export const uploadFile = (id, requirementData) => {
  return api.post(
    `/students/requirements/upload_image/${id}`,
    requirementData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const deleteRequirement = (id, reqId) =>
  api.delete(`/students/requirements/remove_image/${id}/${reqId}`);
export const updateRequirement = (id, reqId, requirementData) =>
  api.patch(`/students/requirements/${id}/${reqId}`, requirementData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getAllActivities = () => api.get(`/activity/logs`);
