import React, { useState, useEffect } from 'react';
import { getAppointments, deleteAppointment } from '../services/api';
import '../styles/AppointmentList.css';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await getAppointments();
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Randevular yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) {
            try {
                await deleteAppointment(id);
                setAppointments(appointments.filter(app => app.id !== id));
            } catch (err) {
                console.error('Error deleting appointment:', err);
                alert('Randevu iptal edilirken bir hata oluştu.');
            }
        }
    };

    if (loading) return <div className="container">Yükleniyor...</div>;
    if (error) return <div className="container error-text">{error}</div>;

    return (
        <div className="container">
            <div className="card">
                <h1 className="text-2xl font-bold mb-4">Randevu Listesi</h1>

                {appointments.length === 0 ? (
                    <p>Henüz randevu bulunmamaktadır.</p>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tarih</th>
                                    <th>Hasta Adı</th>
                                    <th>Doktor</th>
                                    <th>Uzmanlık</th>
                                    <th>İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((app) => (
                                    <tr key={app.id}>
                                        <td>
                                            {app.start_time ? new Date(app.start_time).toLocaleString('tr-TR') : '-'}
                                        </td>
                                        <td>
                                            {app.patient ? `${app.patient.name} ${app.patient.surname}` : `Hasta ID: ${app.patient_id}`}
                                        </td>
                                        <td>{app.doctor ? app.doctor.name : '-'}</td>
                                        <td>{app.doctor && app.doctor.specialty ? app.doctor.specialty.name : '-'}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(app.id)}
                                            >
                                                İptal Et
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentList;
