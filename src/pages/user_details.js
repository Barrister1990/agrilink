import { useRouter } from "next/router";
import { useState } from "react";

const UserDetails = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    categories: [],
  });



  const categoriesList = ["Fruits", "Vegetables", "Dairy", "Meat", "Grains"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Details:", formData);
    
    // Save to database (Mock)
    localStorage.setItem("userDetails", JSON.stringify(formData));

    // Redirect to the main page
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Complete Your Profile
        </h2>
        <p className="text-gray-500 text-center">We need a few more details</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Shopping Categories
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categoriesList.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`px-4 py-2 text-sm rounded-lg border ${
                    formData.categories.includes(category)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-orange-600 transition duration-200"
          >
            Continue shopping
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
