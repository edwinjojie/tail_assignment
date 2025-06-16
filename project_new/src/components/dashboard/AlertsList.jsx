import React from 'react';
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';

const AlertsList = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-gray-400" />;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50';
      case 'error':
        return 'bg-red-50';
      case 'info':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
      {alerts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No alerts to display</div>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id} className={`p-4 hover:${getAlertBgColor(alert.type)} transition-colors duration-150`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {alert.time}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button className="inline-flex text-xs font-medium text-blue-600 hover:text-blue-500">
                    Mark as read
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertsList;