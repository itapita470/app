import React from 'react';
import { AppIcon } from './AppIcon';
import type { AppInfo } from '../types';

interface HomeScreenProps {
  apps: AppInfo[];
  onAppClick: (appId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ apps, onAppClick }) => {
  return (
    <div className="flex-grow p-6 pt-20 pb-28">
      <div className="grid grid-cols-4 gap-y-6">
        {apps.map(app => (
          <AppIcon key={app.id} app={app} onAppClick={onAppClick} />
        ))}
      </div>
    </div>
  );
};
