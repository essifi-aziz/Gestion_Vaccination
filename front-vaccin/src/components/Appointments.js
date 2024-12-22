import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    vaccine: { id: '' },
    appointmentDate: '',
    status: ''
  });
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    vaccine: { id: '' },
    appointmentDate: '',
    status: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchVaccines();
  }, []);

  const fetchAppointments = () => {
    fetch('http://localhost:8787/api/appointments')
      .then((response) => response.json())
      .then((data) => setAppointments(data))
      .catch((error) => console.error('Error fetching appointments:', error));
  };

  const fetchVaccines = () => {
    fetch('http://localhost:8787/api/vaccines')
      .then((response) => response.json())
      .then((data) => setVaccines(data))
      .catch((error) => console.error('Error fetching vaccines:', error));
  };

  const handleUpdate = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientName: appointment.patientName,
      vaccine: { id: appointment.vaccine?.id || '' },
      appointmentDate: appointment.appointmentDate?.split('.')[0] || '',
      status: appointment.status || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await fetch(`http://localhost:8787/api/appointments/${id}`, {
          method: 'DELETE'
        });
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8787/api/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8787/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment)
      });
      setIsAddModalOpen(false);
      setNewAppointment({
        patientName: '',
        vaccine: { id: '' },
        appointmentDate: '',
        status: ''
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">Appointments</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
            title="Add new appointment"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Add Appointment</span>
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Patient Name</th>
              <th className="py-4 px-6">Vaccine</th>
              <th className="py-4 px-6">Appointment Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="py-4 px-6 text-gray-800">{appointment.id}</td>
                <td className="py-4 px-6 text-gray-800">{appointment.patientName || 'N/A'}</td>
                <td className="py-4 px-6 text-gray-800">{appointment.vaccine?.name || 'N/A'}</td>
                <td className="py-4 px-6 text-gray-800">
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleString()
                    : 'N/A'}
                </td>
                <td className="py-4 px-6 text-gray-800">{appointment.status || 'N/A'}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdate(appointment)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      title="Edit appointment"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                      title="Delete appointment"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal d'ajout */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="text-xl font-semibold mb-4">Add New Appointment</h3>
              <form onSubmit={handleAddAppointment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                    <input
                      type="text"
                      value={newAppointment.patientName}
                      onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vaccine</label>
                    <select
                      value={newAppointment.vaccine.id}
                      onChange={(e) => setNewAppointment({
                        ...newAppointment,
                        vaccine: { id: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    >
                      <option value="">Select a vaccine</option>
                      {vaccines.map(vaccine => (
                        <option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
                    <input
                      type="datetime-local"
                      value={newAppointment.appointmentDate}
                      onChange={(e) => setNewAppointment({...newAppointment, appointmentDate: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={newAppointment.status}
                      onChange={(e) => setNewAppointment({...newAppointment, status: e.target.value || null})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="null">Unknown</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de mise à jour */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="text-xl font-semibold mb-4">Update Appointment</h3>
              <form onSubmit={handleSubmitUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vaccine</label>
                    <select
                      value={formData.vaccine.id}
                      onChange={(e) => setFormData({
                        ...formData,
                        vaccine: { id: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a vaccine</option>
                      {vaccines.map(vaccine => (
                        <option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
                    <input
                      type="datetime-local"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value === 'null' ? null : e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="null">Unknown</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
