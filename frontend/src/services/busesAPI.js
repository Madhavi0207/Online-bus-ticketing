import api from "./api"; // Assuming api is the base axios instance

const busesAPI = {
  getAll: () => api.get("/buses"), // Adjust endpoint as per backend
  getById: (id) => api.get(`/buses/${id}`),
  create: (data) => api.post("/buses", data),
  update: (id, data) => api.put(`/buses/${id}`, data),
  delete: (id) => api.delete(`/buses/${id}`),
};

export default busesAPI;
