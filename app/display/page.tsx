'use client';

import { useEffect, useState, useRef } from 'react';
import { IAd } from '@/models/Ad';
import { IMessage } from '@/models/Message';
import MessageTicker from '@/components/MessageTicker';
import { AdDisplay } from '@/components/AdDisplay';
import { Maximize, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DisplayPage() {
    const [ads, setAds] = useState<IAd[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [loadedAds, setLoadedAds] = useState<Set<string>>(new Set());

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

    const handleMediaLoaded = (id: string) => {
        setLoadedAds((prev) => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    const progress = ads.length > 0 ? Math.round((loadedAds.size / ads.length) * 100) : 0;
    const isFullyLoaded = ads.length > 0 && loadedAds.size === ads.length;

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

    // Ad Rotation Logic
    useEffect(() => {
        if (!hasInteracted || ads.length === 0) return;

        const currentAd = ads[currentAdIndex];
        let timer: NodeJS.Timeout;

        if (currentAd && currentAd.type === 'image') {
            timer = setTimeout(() => {
                nextAd();
            }, (currentAd.duration || 10) * 1000);
        }
        // Video rotation is handled by callbacks from AdDisplay

        return () => clearTimeout(timer);
    }, [currentAdIndex, ads, hasInteracted]);

    const prevAd = () => {
        setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
    };

    // ...

    return (
        <div className="h-dvh w-screen bg-black overflow-hidden flex flex-col relative font-sans">
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden min-h-0">
                {/* Pre-mount ALL ads for seamless headers and caching */}
                {ads.length > 0 && ads.map((ad, index) => {
                    const isActive = index === currentAdIndex && hasInteracted;
                    return (
                        <AdDisplay
                            key={ad._id as unknown as string}
                            ad={ad}
                            isActive={isActive}
                            onLoaded={handleMediaLoaded}
                            onVideoEnded={handleVideoEnded}
                            onError={handleError}
                        />
                    );
                })}

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
                            <div className="mt-8 flex flex-col items-center gap-2">
                                <p className="text-white/50 text-lg font-mono uppercase tracking-widest">
                                    {isFullyLoaded ? 'System Ready' : `Loading Media... ${progress}%`}
                                </p>
                                {/* Progress Bar */}
                                {!isFullyLoaded && (
                                    <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {hasInteracted && ads.length === 0 && (
                    <div className="text-white/50 text-xl">No Ads Configured</div>
                )}
            </div>

            {/* MESSAGE TICKER */}
            <MessageTicker messages={messages} />



            {/* NAVIGATION CONTROLS & INDICATORS */}
            {hasInteracted && (
                <ControlsOverlay
                    total={ads.length}
                    current={currentAdIndex}
                    onNext={nextAd}
                    onPrev={prevAd}
                    onDotClick={setCurrentAdIndex}
                />
            )}
        </div>
    );
}

interface ControlsOverlayProps {
    total: number;
    current: number;
    onNext: () => void;
    onPrev: () => void;
    onDotClick: (index: number) => void;
}

function ControlsOverlay({ total, current, onNext, onPrev, onDotClick }: ControlsOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>(null);

    const showControls = () => {
        setIsVisible(true);
        resetTimer();
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 3000); // Hide after 3 seconds
    };

    const handleInteraction = () => {
        showControls();
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div
            className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Previous Button (Left) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="p-4 rounded-full bg-black/20 hover:bg-black/50 text-white/50 hover:text-white backdrop-blur-sm transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            </div>

            {/* Next Button (Right) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="p-4 rounded-full bg-black/20 hover:bg-black/50 text-white/50 hover:text-white backdrop-blur-sm transition-all hover:scale-110"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* Bottom Controls (Dots + Fullscreen) */}
            <div className="absolute bottom-24 left-0 right-0 flex items-end justify-center pointer-events-auto px-8">

                {/* Pagination Dots */}
                {total > 1 && (
                    <div className="flex gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full mb-1">
                        {Array.from({ length: total }).map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); onDotClick(i); }}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current
                                    ? 'bg-white scale-125'
                                    : 'bg-white/30 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Fullscreen Toggle (Absolute Right) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                    }}
                    className="absolute right-8 bottom-0 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white/50 hover:text-white transition-opacity duration-500"
                    title="Toggle Fullscreen"
                >
                    <Maximize className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
