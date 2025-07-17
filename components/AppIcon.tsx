import React from 'react';
import type { AppInfo } from '../types';

interface AppIconProps {
  app: AppInfo;
  onAppClick: (appId: string) => void;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, onAppClick }) => {
  const IconComponent = app.icon;

  const handleClick = () => {
    onAppClick(app.id);
  };

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
      role="button"
      aria-label={`Open ${app.name}`}
      tabIndex={0}
    >
      <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95 group-active:opacity-80 ${app.color}`}>
        <IconComponent className="w-9 h-9 text-white" />
      </div>
      <span className="text-white text-xs font-medium drop-shadow-sm">
        {app.name}
      </span>
    </div>
  );
};