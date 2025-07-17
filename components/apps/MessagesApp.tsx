import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { SendIcon } from '../icons/SendIcon';

interface MessagesAppProps {
    onClose: () => void;
    conversations: Conversation[];
    onSendMessage: (conversationId: string, text: string) => void;
}

const ConversationListItem: React.FC<{ conversation: Conversation; onClick: () => void }> = ({ conversation, onClick }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    const getPreviewText = () => {
        if (!lastMessage) return 'No messages yet';
        if (lastMessage.isLoading) return '...';
        const prefix = lastMessage.sender === 'me' ? 'You: ' : '';
        return `${prefix}${lastMessage.text}`;
    };

    return (
        <li onClick={onClick} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-800 transition-colors border-b border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-xl">
                {conversation.contactName.charAt(0)}
            </div>
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-white truncate">{conversation.contactName}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{lastMessage?.timestamp}</p>
                </div>
                <p className="text-sm text-gray-400 truncate mt-0.5">
                    {getPreviewText()}
                </p>
            </div>
        </li>
    );
};

const ChatView: React.FC<{
    conversation: Conversation;
    onBack: () => void;
    onSendMessage: (text: string) => void;
}> = ({ conversation, onBack, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    const TypingIndicator = () => (
        <div className="flex items-center self-start">
            <div className="flex items-center space-x-1 p-3 rounded-2xl bg-gray-700">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-gray-900">
            <header className="h-14 flex items-center px-4 bg-gray-800/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-700 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-blue-400 hover:text-blue-300 transition-colors" aria-label="Back to Conversations">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold text-white truncate text-center flex-grow">{conversation.contactName}</h1>
                <div className="w-10"></div>
            </header>
            <div className="flex-grow overflow-y-auto p-4 flex flex-col space-y-2">
                {conversation.messages.map((msg) => (
                    msg.isLoading ? (
                        <TypingIndicator key={msg.id} />
                    ) : (
                    <div
                        key={msg.id}
                        className={`flex flex-col gap-1 max-w-[80%] ${
                            msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                    >
                        <div className={`px-4 py-2.5 rounded-2xl ${
                            msg.sender === 'me'
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-gray-700 text-gray-200 rounded-bl-md'
                        }`}>
                            <p className="text-base break-words">{msg.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 px-2">{msg.timestamp}</p>
                    </div>
                    )
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-gray-700/50 bg-gray-800/90 backdrop-blur-md flex-shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Message..."
                        className="flex-grow bg-gray-700 text-white rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        autoComplete="off"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full disabled:bg-gray-600 transition-all transform active:scale-90 disabled:scale-100">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export const MessagesApp: React.FC<MessagesAppProps> = ({ onClose, conversations, onSendMessage }) => {
    const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);

    const selectedConvo = conversations.find(c => c.id === selectedConvoId);
    
    return (
        <div className="bg-gray-900 w-full h-full flex flex-col text-white">
            <div className="flex-grow overflow-hidden">
                {selectedConvo ? (
                    <ChatView 
                        conversation={selectedConvo} 
                        onBack={() => setSelectedConvoId(null)}
                        onSendMessage={(text) => onSendMessage(selectedConvo.id, text)}
                    />
                ) : (
                    <div className="h-full flex flex-col">
                        <header className="h-14 flex items-center justify-center px-4 bg-gray-800/80 backdrop-blur-md flex-shrink-0 z-10 border-b border-gray-700">
                            <h1 className="text-lg font-bold text-white">Messages</h1>
                        </header>
                        <ul className="overflow-y-auto flex-grow">
                           {conversations.map(convo => (
                               <ConversationListItem key={convo.id} conversation={convo} onClick={() => setSelectedConvoId(convo.id)} />
                           ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="sticky bottom-0 left-0 right-0 h-8 flex justify-center items-end pb-2 mt-auto bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
                <button onClick={onClose} className="w-36 h-1.5 bg-white/80 rounded-full hover:bg-white transition" aria-label="Go to Home Screen"></button>
            </div>
        </div>
    );
};
