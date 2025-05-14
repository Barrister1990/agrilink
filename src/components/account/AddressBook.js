import { supabase } from '@/lib/supabaseClient';
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";

const AddressBook = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      console.log("My Address",data)
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (address = null) => {
    if (address) {
      // Edit existing address
      setAddressToEdit(address);
      setFormData({
        name: address.name || '',
        phone: address.phone || '',
        address_line1: address.address_line1 || '',
        address_line2: address.address_line2 || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        country: address.country || 'United States',
        is_default: address.is_default || false
      });
    } else {
      // Add new address
      setAddressToEdit(null);
      setFormData({
        name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'United States',
        is_default: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addressData = {
        user_id: userId,
        name: formData.name,
        phone: formData.phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        is_default: formData.is_default,
        address_type: 'shipping' // You might want to make this selectable
      };

      if (addressToEdit) {
        // Update existing address
        const { error } = await supabase
          .from('user_addresses')
          .update(addressData)
          .eq('id', addressToEdit.id);

        if (error) throw error;
      } else {
        // Add new address
        const { error } = await supabase
          .from('user_addresses')
          .insert(addressData);

        if (error) throw error;
      }

      // Refresh the address list
      fetchAddresses();
      closeModal();
    } catch (error) {
      console.error('Error saving address:', error.message);
      alert('Error saving your address. Please try again.');
    }
  };

  const handleDelete = async (addressId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        const { error } = await supabase
          .from('user_addresses')
          .delete()
          .eq('id', addressId);

        if (error) throw error;
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error.message);
        alert('Error deleting address. Please try again.');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      // First, set all addresses to non-default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then set the selected address as default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error.message);
      alert('Error updating default address. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Address Book</h2>
        <button
          className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
          onClick={() => openModal()}
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" /> Add New Address
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <p className="text-gray-500 text-lg">You haven't added any addresses yet.</p>
          <button
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
            onClick={() => openModal()}
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative ${
                address.is_default ? 'border-2 border-green-500' : ''
              }`}
            >
              {address.is_default && (
                <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Default
                </span>
              )}
              <div className="mb-4">
                <p className="text-xl font-semibold text-gray-900">{address.name}</p>
                <p className="text-gray-600 mt-1">{address.phone}</p>
                <p className="text-gray-600 mt-1">{address.address_line1}</p>
                {address.address_line2 && (
                  <p className="text-gray-600">{address.address_line2}</p>
                )}
                <p className="text-gray-600">
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p className="text-gray-600">{address.country}</p>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  className="text-gray-500 hover:text-green-600 transition-colors duration-300 flex items-center"
                  onClick={() => openModal(address)}
                >
                  <PencilIcon className="w-5 h-5 mr-1" /> Edit
                </button>
                <button
                  className="text-gray-500 hover:text-red-600 transition-colors duration-300 flex items-center"
                  onClick={() => handleDelete(address.id)}
                >
                  <TrashIcon className="w-5 h-5 mr-1" /> Delete
                </button>
                {!address.is_default && (
                  <button
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-300 text-sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    {addressToEdit ? 'Edit Address' : 'Add New Address'}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          name="address_line1"
                          value={formData.address_line1}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          name="address_line2"
                          value={formData.address_line2}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          {/* Add more countries as needed */}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_default"
                            checked={formData.is_default}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Set as default address
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                      >
                        {addressToEdit ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AddressBook;