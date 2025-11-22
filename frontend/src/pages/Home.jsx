import React, { useState, useEffect } from 'react';
import { getSpecialties, getDoctors, createAppointment } from '../services/api';
import '../styles/Home.css';

const Home = () => {
    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_surname: '',
        specialization_id: '',
        doctor_id: '',
        appointment_date: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = async () => {
        try {
            const response = await getSpecialties();
            setSpecializations(response.data);
        } catch (error) {
            console.error('Error fetching specializations:', error);
            setMessage({ type: 'error', text: 'Uzmanlık alanları yüklenirken bir hata oluştu.' });
        }
    };

    const handleSpecializationChange = async (e) => {
        const specialtyId = e.target.value;
        setFormData({ ...formData, specialization_id: specialtyId, doctor_id: '' });
        setDoctors([]);

        if (specialtyId) {
            try {
                const response = await getDoctors(specialtyId);
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setMessage({ type: 'error', text: 'Doktorlar yüklenirken bir hata oluştu.' });
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await createAppointment(formData);
            setMessage({ type: 'success', text: 'Randevu başarıyla oluşturuldu!' });
            setFormData({
                patient_name: '',
                patient_surname: '',
                specialization_id: '',
                doctor_id: '',
                appointment_date: ''
            });
            setDoctors([]);
        } catch (error) {
            console.error('Error creating appointment:', error);
            setMessage({ type: 'error', text: 'Randevu oluşturulurken bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card home-card">
                <h1 className="text-2xl font-bold mb-4">Randevu Oluştur</h1>

                {message.text && (
                    <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Ad</label>
                        <input
                            type="text"
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Soyad</label>
                        <input
                            type="text"
                            name="patient_surname"
                            value={formData.patient_surname}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Uzmanlık Alanı</label>
                        <select
                            name="specialization_id"
                            value={formData.specialization_id}
                            onChange={handleSpecializationChange}
                            className="form-select"
                            required
                        >
                            <option value="">Seçiniz</option>
                            {specializations.map((spec) => (
                                <option key={spec.id} value={spec.id}>
                                    {spec.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Doktor</label>
                        <select
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            className="form-select"
                            required
                            disabled={!formData.specialization_id}
                        >
                            <option value="">Seçiniz</option>
                            {doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Randevu Tarihi</label>
                        <input
                            type="datetime-local"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Gönderiliyor...' : 'Randevu Oluştur'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
