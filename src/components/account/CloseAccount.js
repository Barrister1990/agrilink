const CloseAccount = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-red-600 mb-6">Close Account</h2>

      {/* Warning Message */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-100 mb-8">
        <p className="text-red-700">
          <span className="font-semibold">Warning:</span> If you close your account, you will lose
          access to all your data, including order history, saved addresses, and preferences. This
          action is irreversible. Proceed with caution.
        </p>
      </div>

      {/* Confirmation Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Type <span className="font-semibold">CLOSE MY ACCOUNT</span> to confirm:
        </label>
        <input
          type="text"
          placeholder="CLOSE MY ACCOUNT"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* Close Account Button */}
      <button
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
        onClick={() => {
          // Add confirmation logic here
          const confirmed = window.confirm(
            "Are you sure you want to close your account? This action cannot be undone."
          );
          if (confirmed) {
            alert("Your account has been closed.");
            // Add account closure logic here
          }
        }}
      >
        Close My Account
      </button>
    </div>
  );
};

export default CloseAccount;