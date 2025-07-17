import React, { useState } from 'react';
import { AppInfo, Conversation, Message } from './types';
import { StatusBar } from './components/StatusBar';
import { HomeScreen } from './components/HomeScreen';
import { Dock } from './components/Dock';
import { PhoneIcon } from './components/icons/PhoneIcon';
import { BrowserIcon } from './components/icons/BrowserIcon';
import { MessagesIcon } from './components/icons/MessagesIcon';
import { MusicIcon } from './components/icons/MusicIcon';
import { MailIcon } from './components/icons/MailIcon';
import { PhotosIcon } from './components/icons/PhotosIcon';
import { CameraIcon } from './components/icons/CameraIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { WeatherIcon } from './components/icons/WeatherIcon';
import { PhoneApp } from './components/apps/PhoneApp';
import { MailApp } from './components/apps/MailApp';
import { PhotosApp } from './components/apps/PhotosApp';
import { CameraApp } from './components/apps/CameraApp';
import { BrowserApp } from './components/apps/BrowserApp';
import { MessagesApp } from './components/apps/MessagesApp';
import { GoogleGenAI } from '@google/genai';

const homeScreenApps: AppInfo[] = [
  { id: 'mail', name: 'Mail', icon: MailIcon, color: 'bg-blue-500' },
  { id: 'photos', name: 'Photos', icon: PhotosIcon, color: 'bg-gradient-to-br from-purple-500 via-red-500 to-yellow-500' },
  { id: 'camera', name: 'Camera', icon: CameraIcon, color: 'bg-gray-700' },
  { id: 'weather', name: 'Weather', icon: WeatherIcon, color: 'bg-indigo-400' },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'bg-gray-500' },
];

const dockApps: AppInfo[] = [
  { id: 'phone', name: 'Phone', icon: PhoneIcon, color: 'bg-green-500' },
  { id: 'browser', name: 'Browser', icon: BrowserIcon, color: 'bg-sky-500' },
  { id: 'messages', name: 'Messages', icon: MessagesIcon, color: 'bg-lime-500' },
  { id: 'music', name: 'Music', icon: MusicIcon, color: 'bg-rose-500' },
];

const initialConversations: Conversation[] = [
    {
        id: '1',
        contactName: 'Mom',
        messages: [
            { id: '1', text: 'Hey! Are you free for dinner tonight?', sender: 'other', timestamp: '5:30 PM' },
            { id: '2', text: 'I am! What time were you thinking?', sender: 'me', timestamp: '5:31 PM' },
             { id: '3', text: 'Around 7? Your favorite place!', sender: 'other', timestamp: '5:32 PM' },
        ],
    },
    {
        id: '2',
        contactName: 'Alex (Work)',
        messages: [
            { id: '4', text: 'Did you see the new project mockups?', sender: 'other', timestamp: '3:15 PM' },
        ],
    },
    {
        id: '3',
        contactName: 'Casey',
        messages: [
             { id: '5', text: 'Movie night this Friday?', sender: 'other', timestamp: 'Yesterday' },
        ]
    }
];

const App: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const openApp = (appId: string) => {
    const implementedApps = ['phone', 'mail', 'photos', 'camera', 'browser', 'messages'];
    if (implementedApps.includes(appId)) {
        setActiveApp(appId);
    } else {
      alert(`App "${appId}" is not implemented yet.`);
    }
  };

  const closeApp = () => {
    setActiveApp(null);
  };

  const handleTakePhoto = (photoDataUrl: string) => {
    setPhotos(currentPhotos => [photoDataUrl, ...currentPhotos]);
  };
  
  const handleSendMessage = async (conversationId: string, text: string) => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const newMessage: Message = {
            id: now.getTime().toString(),
            text,
            sender: 'me',
            timestamp,
        };
        
        const loadingMessage: Message = {
            id: (now.getTime() + 1).toString(),
            text: '...',
            sender: 'other',
            timestamp: '',
            isLoading: true,
        };

        setConversations(prev =>
            prev.map(convo =>
                convo.id === conversationId
                    ? { ...convo, messages: [...convo.messages, newMessage, loadingMessage] }
                    : convo
            )
        );

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const conversation = conversations.find(c => c.id === conversationId);
            const prompt = `You are ${conversation?.contactName}. Continue this SMS conversation based on the last message. The user just said: "${text}". Keep your response short and conversational, like a real text message. Do not add your name or any prefixes.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const aiText = response.text;
            
            const aiMessage: Message = {
                id: (now.getTime() + 1).toString(),
                text: aiText.trim(),
                sender: 'other',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            };

            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId
                        ? { ...convo, messages: [...convo.messages.slice(0, -1), aiMessage] }
                        : convo
                )
            );

        } catch (error) {
            console.error("Error generating AI response:", error);
             const errorMessage: Message = {
                id: (now.getTime() + 1).toString(),
                text: 'Sorry, I can\'t talk right now.',
                sender: 'other',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            };
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === conversationId
                        ? { ...convo, messages: [...convo.messages.slice(0, -1), errorMessage] }
                        : convo
                )
            );
        }
    };

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'phone':
        return <PhoneApp onClose={closeApp} />;
      case 'mail':
        return <MailApp onClose={closeApp} />;
      case 'messages':
        return <MessagesApp onClose={closeApp} conversations={conversations} onSendMessage={handleSendMessage} />;
      case 'photos':
        return <PhotosApp onClose={closeApp} photos={photos} openApp={openApp} />;
      case 'camera':
        return <CameraApp onClose={closeApp} onTakePhoto={handleTakePhoto} />;
      case 'browser':
        return <BrowserApp onClose={closeApp} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[390px] h-[844px] bg-black rounded-[48px] shadow-2xl shadow-black/50 overflow-hidden relative border-4 border-gray-800 flex flex-col">
      {/* Wallpaper */}
      <img 
        src="https://picsum.photos/id/1015/390/844" 
        alt="Wallpaper" 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10"></div>

      <StatusBar />
      
      <main className="relative z-10 flex flex-col flex-grow h-full">
         {activeApp ? (
          <div className="absolute inset-0 z-30 animate-fade-in">
            {renderActiveApp()}
          </div>
        ) : (
          <>
            <HomeScreen apps={homeScreenApps} onAppClick={openApp} />
            <Dock apps={dockApps} onAppClick={openApp} />
          </>
        )}
      </main>

    </div>
  );
};

export default App;
