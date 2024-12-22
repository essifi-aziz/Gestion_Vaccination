import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function Vaccines() {
  const [vaccines, setVaccines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    stock: 0
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    manufacturer: '',
    stock: 0
  });

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = () => {
    fetch('http://localhost:8787/api/vaccines')
      .then((response) => response.json())
      .then((data) => setVaccines(data))
      .catch((error) => console.error('Error fetching vaccines:', error));
  };

  const handleUpdate = (vaccine) => {
    setSelectedVaccine(vaccine);
    setFormData({
      name: vaccine.name,
      manufacturer: vaccine.manufacturer,
      stock: vaccine.stock
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vaccin ?')) {
      try {
        await fetch(`http://localhost:8787/api/vaccines/${id}`, {
          method: 'DELETE'
        });
        fetchVaccines();
      } catch (error) {
        console.error('Error deleting vaccine:', error);
      }
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8787/api/vaccines/${selectedVaccine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchVaccines();
    } catch (error) {
      console.error('Error updating vaccine:', error);
    }
  };

  const handleAddVaccine = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8787/api/vaccines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVaccine)
      });
      setIsAddModalOpen(false);
      setNewVaccine({ name: '', manufacturer: '', stock: 0 });
      fetchVaccines();
    } catch (error) {
      console.error('Error adding vaccine:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">Vaccines</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
            title="Add new vaccine"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Add Vaccine</span>
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Manufacturer</th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map((vaccine) => (
              <tr key={vaccine.id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="py-4 px-6 text-gray-800">{vaccine.id}</td>
                <td className="py-4 px-6 text-gray-800">{vaccine.name}</td>
                <td className="py-4 px-6 text-gray-800">{vaccine.manufacturer}</td>
                <td className="py-4 px-6 text-gray-800">{vaccine.stock}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdate(vaccine)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      title="Edit vaccine"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vaccine.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                      title="Delete vaccine"
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
              <h3 className="text-xl font-semibold mb-4">Add New Vaccine</h3>
              <form onSubmit={handleAddVaccine}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={newVaccine.name}
                      onChange={(e) => setNewVaccine({...newVaccine, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <input
                      type="text"
                      value={newVaccine.manufacturer}
                      onChange={(e) => setNewVaccine({...newVaccine, manufacturer: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={newVaccine.stock}
                      onChange={(e) => setNewVaccine({...newVaccine, stock: parseInt(e.target.value)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
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
                    Add Vaccine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de mise à jour */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="text-xl font-semibold mb-4">Update Vaccine</h3>
              <form onSubmit={handleSubmitUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
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

export default Vaccines;
