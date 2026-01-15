'use client';

import { useState, useEffect } from 'react';
import { IAd } from '@/models/Ad';
import { IMessage } from '@/models/Message';
import AdForm from '@/components/AdForm';
import MessageForm from '@/components/MessageForm';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, Monitor, FileVideo, FileImage, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function AdminDashboard() {
    const [ads, setAds] = useState<IAd[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);

    // Ad State
    const [editingAd, setEditingAd] = useState<IAd | null>(null);
    const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
    const [deletingAdId, setDeletingAdId] = useState<string | null>(null);

    // Message State
    const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

    const router = useRouter();

    const fetchAds = async () => {
        const res = await fetch('/api/ads');
        if (res.ok) setAds(await res.json());
    };

    const fetchMessages = async () => {
        const res = await fetch('/api/messages');
        if (res.ok) setMessages(await res.json());
    };

    useEffect(() => {
        fetchAds();
        fetchMessages();
    }, []);

    // --- AD HANDLERS ---
    const handleCreateAd = async (data: Partial<IAd>) => {
        const loadingToast = toast.loading("Creating ad...");
        const res = await fetch('/api/ads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Ad created successfully");
            setIsAdDialogOpen(false);
            fetchAds();
        } else {
            toast.dismiss(loadingToast);
            toast.error("Failed to create ad");
        }
    };

    const handleUpdateAd = async (data: Partial<IAd>) => {
        if (!editingAd) return;
        const loadingToast = toast.loading("Updating ad...");
        const res = await fetch(`/api/ads/${editingAd._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Ad updated successfully");
            setEditingAd(null);
            setIsAdDialogOpen(false);
            fetchAds();
        } else {
            toast.dismiss(loadingToast);
            toast.error("Failed to update ad");
        }
    };

    const confirmDeleteAd = async () => {
        if (!deletingAdId) return;
        const loadingToast = toast.loading("Deleting ad...");
        const res = await fetch(`/api/ads/${deletingAdId}`, { method: 'DELETE' });
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Ad deleted successfully");
            setDeletingAdId(null);
            fetchAds();
        } else {
            toast.dismiss(loadingToast);
            toast.error("Failed to delete ad");
        }
    };

    const openCreateAd = () => {
        setEditingAd(null);
        setIsAdDialogOpen(true);
    };

    const openEditAd = (ad: IAd) => {
        setEditingAd(ad);
        setIsAdDialogOpen(true);
    };

    // --- MESSAGE HANDLERS ---
    const handleCreateMessage = async (data: Partial<IMessage>) => {
        const loadingToast = toast.loading("Creating message...");
        const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Message created successfully");
            setIsMessageDialogOpen(false);
            fetchMessages();
        } else {
            toast.dismiss(loadingToast);
            toast.error("Failed to create message");
        }
    };

    const handleUpdateMessage = async (data: Partial<IMessage>) => {
        if (!editingMessage) return;
        const loadingToast = toast.loading("Updating message...");
        const res = await fetch(`/api/messages/${editingMessage._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Message updated successfully");
            setEditingMessage(null);
            setIsMessageDialogOpen(false);
            fetchMessages();
        } else {
            toast.dismiss(loadingToast);
            toast.error("Failed to update message");
        }
    };

    const confirmDeleteMessage = async () => {
        if (!deletingMessageId) return;
        const loadingToast = toast.loading("Deleting message...");
        const res = await fetch(`/api/messages/${deletingMessageId}`, { method: 'DELETE' });
        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Message deleted successfully");
            setDeletingMessageId(null);
            fetchMessages();
        } else {
            toast.dismiss(loadingToast);
            toast.error("Failed to delete message");
        }
    };

    const openCreateMessage = () => {
        setEditingMessage(null);
        setIsMessageDialogOpen(true);
    };

    const openEditMessage = (msg: IMessage) => {
        setEditingMessage(msg);
        setIsMessageDialogOpen(true);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success("Logged out successfully");
        router.push('/admin/login');
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Digital Signage Admin</h1>
                    <p className="text-muted-foreground mt-1">Manage displayed ads and ticker messages.</p>
                </div>
                <div className="space-x-4 flex items-center">
                    <Button onClick={() => router.push('/display')} variant="secondary">
                        <Monitor className="mr-2 h-4 w-4" /> Go to Display
                    </Button>
                    <Button onClick={handleLogout} variant="ghost" className="text-muted-foreground hover:text-destructive">Sign Out</Button>
                </div>
            </div>

            <Tabs defaultValue="ads" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="ads">Ads (Images & Videos)</TabsTrigger>
                    <TabsTrigger value="messages">Ticker Messages</TabsTrigger>
                </TabsList>

                {/* --- ADS TAB --- */}
                <TabsContent value="ads">
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                            <h2 className="font-semibold text-lg">Active Advertisements</h2>
                            <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={openCreateAd}><Plus className="mr-2 h-4 w-4" /> Add Ad</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingAd ? 'Edit Ad' : 'Create New Ad'}</DialogTitle>
                                    </DialogHeader>
                                    <AdForm
                                        initialData={editingAd || undefined}
                                        onSubmit={editingAd ? handleUpdateAd : handleCreateAd}
                                        onCancel={() => setIsAdDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <div className="col-span-1 text-center">Order</div>
                            <div className="col-span-1 text-center">Type</div>
                            <div className="col-span-6">Title & URL</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        <div className="divide-y">
                            {ads.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    No ads found. Create one to get started.
                                </div>
                            ) : (
                                ads.map((ad) => (
                                    <div key={ad._id as unknown as string} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors ${!ad.enabled ? 'opacity-50 grayscale' : ''}`}>
                                        <div className="col-span-1 text-center font-mono font-bold text-lg text-muted-foreground">
                                            {ad.order}
                                        </div>
                                        <div className="col-span-1 flex justify-center text-muted-foreground">
                                            {ad.type === 'video' ? <FileVideo className="h-5 w-5" /> : <FileImage className="h-5 w-5" />}
                                        </div>
                                        <div className="col-span-6 overflow-hidden">
                                            <div className="font-semibold text-base truncate">{ad.title}</div>
                                            <div className="text-xs text-muted-foreground truncate font-mono">{ad.url}</div>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${ad.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>
                                                {ad.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-end space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditAd(ad)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingAdId(ad._id as unknown as string)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* --- MESSAGES TAB --- */}
                <TabsContent value="messages">
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                            <h2 className="font-semibold text-lg">Ticker Messages</h2>
                            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={openCreateMessage}><Plus className="mr-2 h-4 w-4" /> Add Message</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingMessage ? 'Edit Message' : 'Create New Message'}</DialogTitle>
                                    </DialogHeader>
                                    <MessageForm
                                        initialData={editingMessage || undefined}
                                        onSubmit={editingMessage ? handleUpdateMessage : handleCreateMessage}
                                        onCancel={() => setIsMessageDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <div className="col-span-2">Name</div>
                            <div className="col-span-6">Message Content</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        <div className="divide-y">
                            {messages.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    No messages found. Create one to get started.
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg._id as unknown as string} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors ${!msg.enabled ? 'opacity-50 grayscale' : ''}`}>
                                        <div className="col-span-2 font-semibold flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                            {msg.name}
                                        </div>
                                        <div className="col-span-6">
                                            <div className="text-sm text-foreground line-clamp-2">{msg.text}</div>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${msg.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'}`}>
                                                {msg.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex justify-end space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditMessage(msg)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingMessageId(msg._id as unknown as string)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* --- DELETE DIALOG (AD) --- */}
            <AlertDialog open={!!deletingAdId} onOpenChange={(open) => !open && setDeletingAdId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this Ad?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the ad from the display rotation immediately. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteAd} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Ad
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* --- DELETE DIALOG (MESSAGE) --- */}
            <AlertDialog open={!!deletingMessageId} onOpenChange={(open) => !open && setDeletingMessageId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this Message?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the message from the ticker immediately. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteMessage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Message
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

