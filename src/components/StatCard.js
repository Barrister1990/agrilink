// components/StatCard.jsx

const StatCard = ({ title, value, change, icon, color }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-start">
      <div className={`${color} rounded-full p-3 text-white`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
        <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last month
        </p>
      </div>
    </div>
  );
};

export default StatCard;