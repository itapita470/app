import React from 'react';

export const EndCallIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 9c-1.6 0-3.15.25-4.62.72v3.1c0 .34-.02.67-.06.99l1.65 1.65c.32-.04.65-.06.99-.06s.67.02.99.06l1.65-1.65c-.03-.32-.05-.66-.05-1 0-1.07.24-2.07.67-2.98A5.04 5.04 0 0012 9z" transform="rotate(135 12 12)" />
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" transform="rotate(135 12 12)"/>
  </svg>
);