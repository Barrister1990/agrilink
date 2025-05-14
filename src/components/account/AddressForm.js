import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

// Ghana regions and cities mapping
const ghanaRegions = {
  "Greater Accra": ["Accra", "Tema", "Madina", "Teshie", "Nungua"],
  Ashanti: ["Kumasi", "Obuasi", "Ejisu", "Mampong", "Bekwai"],
  Central: ["Cape Coast", "Winneba", "Kasoa", "Elmina", "Mankessim"],
  Eastern: ["Koforidua", "Nkawkaw", "Suhum", "Aburi", "Akim Oda"],
  Northern: ["Tamale", "Yendi", "Bimbilla", "Savelugu", "Walewale"],
  Western: ["Sekondi-Takoradi", "Tarkwa", "Axim", "Bogoso", "Agona Nkwanta"],
  Volta: ["Ho", "Keta", "Aflao", "Hohoe", "Sogakope"],
  Bono: ["Sunyani", "Berekum", "Dormaa Ahenkro", "Wenchi", "Techiman"],
  "Upper East": ["Bolgatanga", "Navrongo", "Bawku", "Zebilla", "Paga"],
  "Upper West": ["Wa", "Tumu", "Nandom", "Lawra", "Jirapa"],
  "Western North": ["Sefwi Wiawso", "Bibiani", "Enchi", "Juaboso", "Awaso"],
  Oti: ["Dambai", "Nkwanta", "Kadjebi", "Jasikan", "Worawora"],
  Savannah: ["Damongo", "Bole", "Salaga", "Sawla", "Tolon"],
  "North East": ["Nalerigu", "Gambaga", "Walewale", "Chereponi", "Bunkpurugu"],
  Ahafo: ["Goaso", "Tepa", "Hwidiem", "Duayaw Nkwanta", "Kenyasi"],
  "Bono East": ["Techiman", "Kintampo", "Atebubu", "Nkoranza", "Yeji"],
};

const AddressForm = ({ setActiveSection, addressToEdit }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    region: "",
    city: "",
  });

  // Prefill the form if editing an address
  useEffect(() => {
    if (addressToEdit) {
      setForm(addressToEdit);
    }
  }, [addressToEdit]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle region selection
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setForm({ ...form, region: selectedRegion, city: "" }); // Reset city when region changes
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(addressToEdit ? "Shipping Address Updated!" : "Shipping Address Saved!");
    setActiveSection("address-book");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-300"
        onClick={() => setActiveSection("address-book")}
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Address Book
      </button>

      {/* Form Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {addressToEdit ? "Edit Shipping Address" : "Add Shipping Address"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
        {/* Full Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        {/* Street Address */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Street Address</label>
          <input
            type="text"
            name="street"
            value={form.street}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        {/* Region Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Region</label>
          <select
            name="region"
            value={form.region}
            onChange={handleRegionChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          >
            <option value="">Select a region</option>
            {Object.keys(ghanaRegions).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection (Based on Selected Region) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">City</label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
            disabled={!form.region} // Disable city selection until a region is selected
          >
            <option value="">Select a city</option>
            {form.region &&
              ghanaRegions[form.region].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={() => setActiveSection("address-book")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            {addressToEdit ? "Update Address" : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;