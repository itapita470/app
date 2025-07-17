import React, { useState } from 'react';
import type { Email } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface MailAppProps {
  onClose: () => void;
}

const mockEmails: Email[] = [
    { id: '2', sender: 'React Team', subject: 'New React 19 features', body: 'Hi there, we are excited to announce the latest features in React 19 including the new compiler and Actions. Check out the docs to learn more!', timestamp: '1:10 PM', read: false },
    { id: '1', sender: 'Tailwind CSS', subject: 'Welcome to Tailwind!', body: 'Get started with Tailwind CSS by browsing our extensive documentation. You can find everything you need to build beautiful, modern websites.', timestamp: 'Yesterday', read: true },
    { id: '3', sender: 'GitHub', subject: 'Security alert: New device login', body: 'A new device has logged into your account. If this was not you, please secure your account immediately.', timestamp: 'Yesterday', read: true },
    { id: '4', sender: 'Alice', subject: 'Weekend plans?', body: 'Hey! Are we still on for this weekend? Let me know!', timestamp: '2 days ago', read: true },
];


export const MailApp: React.FC<MailAppProps> = ({ onClose }) => {
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const selectedEmail = mockEmails.find(e => e.id === selectedEmailId);

    const MailHeader: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => (
        <header className="h-14 flex items-center px-4 bg-gray-800/70 backdrop-blur-md sticky top-0 z-10 border-b border-gray-700">
            {onBack ? (
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-blue-400 hover:text-blue-300 transition-colors" aria-label="Back to Inbox">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            ) : <div className="w-10"></div>}
            <h1 className="text-lg font-semibold text-white truncate text-center flex-grow">{title}</h1>
            <div className="w-10"></div>
        </header>
    );

    const InboxView = () => (
        <>
            <MailHeader title="Inbox" />
            <ul className="divide-y divide-gray-700/50">
                {mockEmails.map(email => (
                    <li key={email.id} onClick={() => setSelectedEmailId(email.id)} className="p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-800 transition-colors">
                       {!email.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>}
                       <div className={`flex-grow ${email.read ? 'pl-6' : ''}`}>
                            <div className="flex justify-between items-baseline">
                                <p className={`font-semibold ${email.read ? 'text-gray-200' : 'text-white'}`}>{email.sender}</p>
                                <p className="text-xs text-gray-400">{email.timestamp}</p>
                            </div>
                            <p className={`text-sm mt-0.5 ${email.read ? 'text-gray-300' : 'text-white'}`}>{email.subject}</p>
                            <p className="text-sm text-gray-400 truncate mt-1">{email.body}</p>
                       </div>
                    </li>
                ))}
            </ul>
        </>
    );

    const DetailView = () => (
        <>
            <MailHeader title={selectedEmail!.subject} onBack={() => setSelectedEmailId(null)} />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-white text-lg">{selectedEmail!.sender}</p>
                    <p className="text-sm text-gray-400">{selectedEmail!.timestamp}</p>
                </div>
                <article className="prose prose-invert prose-sm text-gray-300">
                    <p>{selectedEmail!.body}</p>
                </article>
            </div>
        </>
    );
    
    return (
        <div className="bg-gray-900 w-full h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
              {selectedEmailId ? <DetailView /> : <InboxView />}
            </div>
            <div className="sticky bottom-0 left-0 right-0 h-8 flex justify-center items-end pb-2 mt-auto bg-gray-900">
              <button onClick={onClose} className="w-36 h-1.5 bg-white/80 rounded-full hover:bg-white transition" aria-label="Go to Home Screen"></button>
            </div>
        </div>
    );
};
