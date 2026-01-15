'use client';

import { useEffect, useState, useRef } from 'react';
import { IAd } from '@/models/Ad';
import { IMessage } from '@/models/Message';
import MessageTicker from '@/components/MessageTicker';
import { Maximize } from 'lucide-react';

// Helper to convert Drive links to direct view links
const getDirectUrl = (url: string) => {
    try {
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                // 'download' export is often more reliable for direct media src than 'view'
                return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
            }
        }
        return url;
    } catch (e) {
        return url;
    }
};

export default function DisplayPage() {
    const [ads, setAds] = useState<IAd[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Fetch Data
    const fetchData = async () => {
        try {
            const [adsRes, msgsRes] = await Promise.all([
                fetch('/api/ads'),
                fetch('/api/messages')
            ]);

            if (adsRes.ok) {
                const allAds: IAd[] = await adsRes.json();
                setAds(allAds.filter(a => a.enabled));
            }
            if (msgsRes.ok) {
                const allMsgs: IMessage[] = await msgsRes.json();
                setMessages(allMsgs.filter(m => m.enabled));
            }
        } catch (error) {
            console.error('Failed to fetch display data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Ad Rotation Logic
    useEffect(() => {
        if (!hasInteracted || ads.length === 0) return;

        const currentAd = ads[currentAdIndex];
        let timer: NodeJS.Timeout;

        if (currentAd.type === 'image') {
            timer = setTimeout(() => {
                nextAd();
            }, (currentAd.duration || 10) * 1000); // Default to 10s if missing
        } else if (currentAd.type === 'video') {
            if (videoRef.current) {
                videoRef.current.play().catch(e => console.error("Autoplay failed", e));
            }
        }

        return () => clearTimeout(timer);
    }, [currentAdIndex, ads]);

    const nextAd = () => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    };

    const handleVideoEnded = () => {
        nextAd();
    };

    const handleError = () => {
        console.error("Media failed to load, skipping...");
        nextAd();
    }

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-2xl animate-pulse">Loading Display...</div>;
    }

    const currentAd = ads[currentAdIndex];

    return (
        <div className="h-dvh w-screen bg-black overflow-hidden flex flex-col relative font-sans">
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-0">
                {hasInteracted && ads.length > 0 && currentAd && (
                    <>
                        {currentAd.type === 'image' && (
                            <img
                                key={currentAd._id as unknown as string}
                                src={getDirectUrl(currentAd.url)}
                                alt={currentAd.title}
                                className="w-full h-full object-contain animate-in fade-in duration-500"
                                onError={handleError}
                            />
                        )}
                        {currentAd.type === 'video' && (
                            <video
                                key={currentAd._id as unknown as string}
                                ref={videoRef}
                                src={getDirectUrl(currentAd.url)}
                                className="w-full h-full object-contain animate-in fade-in duration-500"
                                autoPlay
                                playsInline
                                muted={currentAd.muted ?? true}
                                onEnded={handleVideoEnded}
                                onError={handleError}
                            />
                        )}
                    </>
                )}

                {/* Interaction / Start Overlay */}
                {!hasInteracted && (
                    <div
                        className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => {
                            setHasInteracted(true);
                        }}
                    >
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="bg-white text-black px-12 py-6 rounded-full text-3xl font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                Click to Start Display
                            </div>
                            <p className="text-white/50 mt-6 text-lg font-mono uppercase tracking-widest">System Ready</p>
                        </div>
                    </div>
                )}

                {hasInteracted && ads.length === 0 && (
                    <div className="text-white/50 text-xl">No Ads Configured</div>
                )}
            </div>

            {/* MESSAGE TICKER */}
            <MessageTicker messages={messages} />

            {/* FULLSCREEN TOGGLE BUTTON - Auto-hides */}
            <ControlsOverlay />
        </div>
    );
}

function ControlsOverlay() {
    const [isVisible, setIsVisible] = useState(true);
    const timerRef = useRef<NodeJS.Timeout>(null);

    const showControls = () => {
        setIsVisible(true);
        resetTimer();
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 5000);
    };

    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div
            className="absolute bottom-24 right-0 p-8 z-[60] flex justify-end items-end"
            onMouseEnter={showControls}
            onMouseMove={showControls}
            onMouseLeave={resetTimer}
        >
            <button
                onClick={() => {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                }}
                className={`bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white/50 hover:text-white transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                title="Toggle Fullscreen"
            >
                <Maximize className="w-6 h-6" />
            </button>
        </div>
    );
}
