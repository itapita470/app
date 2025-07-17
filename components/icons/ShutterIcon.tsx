import React from 'react';

export const ShutterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="4" />
        <circle cx="32" cy="32" r="22" fill="white" className="transition-transform group-active:scale-90" />
    </svg>
);