import React, { useState, useEffect, useRef } from 'react';
import { ShutterIcon } from '../icons/ShutterIcon';
import { SwitchCameraIcon } from '../icons/SwitchCameraIcon';

interface CameraAppProps {
  onClose: () => void;
  onTakePhoto: (photoDataUrl: string) => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ onClose, onTakePhoto }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [error, setError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        let currentStream: MediaStream | null = null;
        
        const getCameraStream = async () => {
            try {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: facingMode }
                });
                currentStream = newStream;
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
                setError(null);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access the camera. Please check permissions.");
                if (err instanceof Error) {
                    setError(`Could not access camera: ${err.message}`);
                }
            }
        };

        getCameraStream();

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        setIsCapturing(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            onTakePhoto(dataUrl);
        }
        setTimeout(() => setIsCapturing(false), 100);
    };

    const handleSwitchCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    return (
        <div className="bg-black w-full h-full flex flex-col text-white relative">
            <div className={`absolute inset-0 bg-black transition-opacity duration-100 ${isCapturing ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: 10 }}></div>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4">
                    <p className="text-center text-red-400">{error}</p>
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center">
                 <div className="w-full flex justify-around items-center px-8">
                    <div className="w-16 h-16"></div>
                    <button onClick={handleTakePhoto} className="w-20 h-20 group" aria-label="Take Photo">
                        <ShutterIcon className="w-full h-full text-white" />
                    </button>
                    <button onClick={handleSwitchCamera} className="w-16 h-16 flex items-center justify-center" aria-label="Switch Camera">
                        <div className="w-10 h-10 rounded-full bg-gray-500/50 flex items-center justify-center active:bg-gray-400/50">
                            <SwitchCameraIcon className="w-6 h-6 text-white" />
                        </div>
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-center items-end pb-2 mt-auto">
                    <button onClick={onClose} className="w-36 h-1.5 bg-white/80 rounded-full hover:bg-white transition" aria-label="Go to Home Screen"></button>
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};
