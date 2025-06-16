import React from 'react';

const SummaryCard = ({ title, value, color, icon, footer }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          valueColor: 'text-blue-700'
        };
      case 'green':
        return {
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          valueColor: 'text-green-700'
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          valueColor: 'text-amber-700'
        };
      case 'red':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          valueColor: 'text-red-700'
        };
      default:
        return {
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          valueColor: 'text-gray-700'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition duration-300 hover:shadow-md group">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses.iconBg} ${colorClasses.iconColor} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className={`text-2xl font-semibold ${colorClasses.valueColor}`}>{value}</dd>
          </div>
        </div>
      </div>
      {footer && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm text-gray-500">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;