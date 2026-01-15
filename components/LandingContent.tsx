'use client';

import Link from 'next/link';
import { Monitor, Settings } from 'lucide-react';

export default function LandingContent() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-16 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 p-6 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">

            {/* Hero / Header */}
            <div className="text-center space-y-6 max-w-2xl">
                <div className="inline-block px-3 py-1 mb-4 text-xs font-mono border border-neutral-200 dark:border-neutral-800 rounded-full uppercase tracking-widest text-neutral-500">
                    System v1.0
                </div>
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-black dark:text-white">
                    InfoBoard
                </h1>
                <p className="text-sm md:text-base text-neutral-500 font-mono uppercase tracking-[0.2em]">
                    Autonomous Digital Signage Interface
                </p>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">

                {/* Display Card */}
                <Link href="/display" className="group relative overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20 p-8 transition-all hover:bg-white dark:hover:bg-neutral-900">
                    <div className="flex flex-col items-start justify-between h-full space-y-8">
                        <div className="p-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white">
                            <Monitor className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium tracking-tight">Display Runtime</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed">
                                Execute high-fidelity visual playback sequence.
                            </p>
                        </div>
                        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 group-hover:scale-x-110 transition-transform origin-left" />
                    </div>
                </Link>

                {/* Admin Card */}
                <Link href="/admin/login" className="group relative overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20 p-8 transition-all hover:bg-white dark:hover:bg-neutral-900">
                    <div className="flex flex-col items-start justify-between h-full space-y-8">
                        <div className="p-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium tracking-tight">Control Center</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed">
                                Configure media assets and data streams.
                            </p>
                        </div>
                        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 group-hover:scale-x-110 transition-transform origin-left" />
                    </div>
                </Link>

            </div>

            <div className="absolute bottom-8 flex flex-col items-center gap-6">
                <button onClick={async () => {
                    await fetch('/api/auth/site-logout', { method: 'POST' });
                    window.location.reload();
                }} className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-neutral-400 pb-1">
                    Terminate Session
                </button>
            </div>
        </div>
    );
}
