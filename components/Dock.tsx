import React from 'react';
import { AppIcon } from './AppIcon';
import type { AppInfo } from '../types';

interface DockProps {
  apps: AppInfo[];
  onAppClick: (appId: string) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, onAppClick }) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 h-24 z-20">
      <div className="bg-black/20 backdrop-blur-xl rounded-[2rem] w-full h-full flex justify-around items-center px-4">
        {apps.map(app => (
          <AppIcon key={app.id} app={app} onAppClick={onAppClick} />
        ))}
      </div>
    </div>
  );
};
