import React from 'react';

export const SwitchCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>
        <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"/>
        <path d="M18 13l3-3-3-3"/>
        <path d="M6 11l-3 3 3 3"/>
    </svg>
);