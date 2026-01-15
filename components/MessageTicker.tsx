'use client';

import { memo } from 'react';
import { IMessage } from '@/models/Message';

interface MessageTickerProps {
    messages: IMessage[];
}

const MessageTicker = memo(function MessageTicker({ messages }: MessageTickerProps) {
    if (messages.length === 0) return null;

    return (
        <div className={`h-24 bg-blue-900 text-white flex items-center overflow-hidden whitespace-nowrap relative border-t-8 border-yellow-500 shadow-2xl z-50 shrink-0 transition-all duration-500 opacity-100 translate-y-0`}>
            {/* Label */}
            <div className="absolute left-0 h-full bg-blue-950 px-8 flex items-center z-20 font-black text-3xl tracking-widest uppercase shadow-[10px_0_20px_rgba(0,0,0,0.5)] text-yellow-500">
                UPDATES
            </div>

            {/* Scrolling Content - Duplicated for seamless loop */}
            <div className="marquee-track py-4 text-5xl font-bold tracking-wide drop-shadow-md">
                {/* First Set */}
                {messages.map((m, i) => (
                    <span key={`1-${i}`} className="mx-8 inline-flex items-center">
                        <span className="text-yellow-400 mr-4 text-3xl">●</span>
                        {m.text}
                    </span>
                ))}
                {/* Second Set (Duplicate) */}
                {messages.map((m, i) => (
                    <span key={`2-${i}`} className="mx-8 inline-flex items-center">
                        <span className="text-yellow-400 mr-4 text-3xl">●</span>
                        {m.text}
                    </span>
                ))}
            </div>
        </div>
    );
});

export default MessageTicker;
