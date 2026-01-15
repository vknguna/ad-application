"use client";

import { useEffect, useRef } from 'react';
import { IAd } from '@/models/Ad';

interface AdDisplayProps {
    ad: IAd;
    isActive: boolean;
    onLoaded: (id: string) => void;
    onVideoEnded?: () => void;
    onError?: () => void;
}

// Helper to convert Drive links
const getDirectUrl = (url: string) => {
    try {
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
            }
        }
        return url;
    } catch (e) {
        return url;
    }
};

export function AdDisplay({ ad, isActive, onLoaded, onVideoEnded, onError }: AdDisplayProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasLoadedRef = useRef(false);

    const handleLoad = () => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            onLoaded(ad._id as unknown as string);
        }
    };

    // Check for already loaded media on mount
    useEffect(() => {
        if (ad.type === 'image' && imgRef.current?.complete) {
            handleLoad();
        }
        if (ad.type === 'video' && videoRef.current && videoRef.current.readyState >= 3) {
            handleLoad();
        }
    }, []);

    // Effect to manage video playback based on active state
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Autoplay prevented:", e);
                });
            }
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isActive]);

    return (
        <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-hidden={!isActive}
        >
            {/* AMBIENT BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {ad.type === 'image' && (
                    <img
                        src={getDirectUrl(ad.url)}
                        alt=""
                        className="w-full h-full object-cover blur-3xl opacity-60 scale-110"
                        loading="eager"
                    />
                )}
                {ad.type === 'video' && (
                    <video
                        src={getDirectUrl(ad.url)}
                        className="w-full h-full object-cover blur-3xl opacity-60 scale-110"
                        muted
                        loop
                        playsInline
                        autoPlay={isActive}
                    />
                )}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* FOREGROUND CONTENT LAYER */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {ad.type === 'image' && (
                    <img
                        ref={imgRef}
                        src={getDirectUrl(ad.url)}
                        alt={ad.title}
                        className="max-w-full max-h-full object-contain shadow-2xl drop-shadow-2xl"
                        loading="eager"
                        onLoad={handleLoad}
                        onError={onError}
                    />
                )}
                {ad.type === 'video' && (
                    <video
                        ref={videoRef}
                        src={getDirectUrl(ad.url)}
                        className="max-w-full max-h-full object-contain shadow-2xl drop-shadow-2xl"
                        playsInline
                        muted={ad.muted ?? true}
                        preload="auto"
                        onEnded={isActive ? onVideoEnded : undefined}
                        onError={onError}
                        onLoadedData={handleLoad}
                    />
                )}
            </div>
        </div>
    );
}
