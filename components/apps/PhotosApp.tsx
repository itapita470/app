import React, { useState } from 'react';
import { CameraIcon } from '../icons/CameraIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface PhotosAppProps {
  onClose: () => void;
  photos: string[];
  openApp: (appId: string) => void;
}

export const PhotosApp: React.FC<PhotosAppProps> = ({ onClose, photos, openApp }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    if (selectedPhoto) {
        return (
            <div className="bg-black w-full h-full flex flex-col relative" onClick={() => setSelectedPhoto(null)} role="button" aria-label="Close photo viewer">
                 <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 left-4 z-20 p-2 bg-black/30 rounded-full text-white" aria-label="Back to photo grid">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex-grow flex items-center justify-center">
                    <img src={selectedPhoto} alt="Selected photo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-center items-end pb-2">
                    <div className="w-36 h-1.5 bg-white/50 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 w-full h-full flex flex-col text-white">
            <header className="h-14 flex items-center justify-center px-4 bg-gray-800/70 backdrop-blur-md sticky top-0 z-10 border-b border-gray-700">
                <h1 className="text-lg font-bold text-white">Photos</h1>
            </header>

            <div className="flex-grow overflow-y-auto">
                {photos.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400 p-8 h-full">
                        <CameraIcon className="w-16 h-16 mb-4 text-gray-500" />
                        <h2 className="text-xl font-semibold text-white">No Photos or Videos</h2>
                        <p className="max-w-xs mt-2">You can take photos using the Camera app.</p>
                        <button onClick={() => openApp('camera')} className="mt-6 bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                            Open Camera
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-0.5 p-0.5">
                        {photos.map((photo, index) => (
                            <div key={index} className="aspect-square bg-gray-800" onClick={() => setSelectedPhoto(photo)}>
                                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover cursor-pointer" loading="lazy" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 left-0 right-0 h-8 flex justify-center items-end pb-2 mt-auto bg-gray-900/80 backdrop-blur-sm">
              <button onClick={onClose} className="w-36 h-1.5 bg-white/80 rounded-full hover:bg-white transition" aria-label="Go to Home Screen"></button>
            </div>
        </div>
    );
};