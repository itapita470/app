
import React, { useState, useEffect } from 'react';

const WifiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zM3 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C12.14 8.14 7.86 8.14 3 13z"/>
  </svg>
);

const BatteryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 5v-2h-4v2h-2v14h8v-14h-2zm-1 12h-4v-10h4v10z"/>
  </svg>
);


export const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update every minute

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="absolute top-0 left-0 right-0 h-11 px-6 flex justify-between items-center text-white z-20">
      <div className="text-sm font-semibold w-14 text-center">
        {formatTime(time)}
      </div>
      <div className="flex items-center gap-2">
        <WifiIcon className="w-4 h-4" />
        <BatteryIcon className="w-5 h-5" />
      </div>
    </div>
  );
};
