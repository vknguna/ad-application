'use client';

import { useEffect, useState, useRef } from 'react';
import { IAd } from '@/models/Ad';
import { IMessage } from '@/models/Message';
import { title } from 'process';

export default function DisplayPage() {
    const [ads, setAds] = useState<IAd[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [loading, setLoading] = useState(true);
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
        const interval = setInterval(fetchData, 60000); // Poll every minute for updates
        return () => clearInterval(interval);
    }, []);

    // Ad Rotation Logic
    useEffect(() => {
        if (ads.length === 0) return;

        const currentAd = ads[currentAdIndex];
        let timer: NodeJS.Timeout;

        if (currentAd.type === 'image') {
            // Display image for 10 seconds
            timer = setTimeout(() => {
                nextAd();
            }, 10000);
        } else if (currentAd.type === 'video') {
            // For video, we rely on the onEnded event, but set a fallback timeout just in case
            // or if we want to force next after a max duration?
            // Better to let video play naturally.
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

    if (ads.length === 0 && messages.length === 0) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-3xl font-bold">
                Digital Signage System Ready
            </div>
        );
    }

    const currentAd = ads[currentAdIndex];

    return (
        <div className="h-screen w-screen bg-black overflow-hidden flex flex-col relative font-sans">
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 relative flex items-center justify-center bg-black">
                {ads.length > 0 && currentAd && (
                    <>
                        {currentAd.type === 'image' && (
                            <img
                                key={currentAd._id as unknown as string} // Key forces re-render for animation
                                src={currentAd.url}
                                alt={currentAd.title}
                                className="w-full h-full object-contain animate-in fade-in duration-500"
                                onError={handleError}
                            />
                        )}
                        {currentAd.type === 'video' && (
                            <video
                                key={currentAd._id as unknown as string}
                                ref={videoRef}
                                src={currentAd.url}
                                className="w-full h-full object-contain animate-in fade-in duration-500"
                                autoPlay
                                muted
                                onEnded={handleVideoEnded}
                                onError={handleError}
                            />
                        )}
                        {/* Optional Title Overlay */}
                        {/* <div className="absolute top-8 left-8 bg-black/50 text-white px-4 py-2 rounded text-xl backdrop-blur-md">
                            {currentAd.title}
                        </div> */}
                    </>
                )}
                {ads.length === 0 && (
                    <div className="text-white/50 text-xl">No Ads Configured</div>
                )}
            </div>

            {/* MESSAGE TICKER */}
            {messages.length > 0 && (
                <div className="h-20 bg-blue-900 text-white flex items-center overflow-hidden whitespace-nowrap relative border-t-4 border-blue-700 shadow-2xl z-20 shrink-0">
                    <div className="absolute left-0 h-full bg-blue-800 px-6 flex items-center z-20 font-bold text-2xl tracking-widest uppercase shadow-md">
                        INFO
                    </div>
                    <div className="animate-marquee inline-block pl-[100%] py-2 text-4xl font-semibold tracking-wide">
                        {messages.map((m, i) => (
                            <span key={i} className="mx-12">
                                {m.text}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
