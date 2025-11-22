import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getSpecialties = () => api.get('/specialties');
export const getDoctors = (specialtyId) => {
    if (specialtyId) {
        return api.get(`/doctors?specialty_id=${specialtyId}`);
    }
    return api.get('/doctors');
};
export const createAppointment = (appointmentData) => api.post('/appointments', appointmentData);
export const getAppointments = () => api.get('/appointments');
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export default api;
