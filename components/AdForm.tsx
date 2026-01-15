'use client';

import { useState, useEffect } from 'react';
import { IAd } from '@/models/Ad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdFormProps {
    initialData?: IAd;
    onSubmit: (data: Partial<IAd>) => Promise<void>;
    onCancel: () => void;
}

export default function AdForm({ initialData, onSubmit, onCancel }: AdFormProps) {
    const [formData, setFormData] = useState<Partial<IAd>>({
        title: '',
        url: '',
        type: 'image',
        enabled: true,
        order: 0,
        muted: true,
        duration: 10,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                type: initialData.type || 'image', // Fallback to image if missing
                muted: initialData.muted !== undefined ? initialData.muted : true,
                duration: initialData.duration || 10,
            });
        }
    }, [initialData]);

    const handleChange = (field: keyof IAd, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    placeholder="e.g. Summer Sale Promo"
                />
            </div>

            <div className="grid gap-2">
                <Label>Media Link (URL)</Label>
                <Input
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    required
                />
            </div>

            {formData.type === 'image' && (
                <div className="grid gap-2">
                    <Label>Duration (Seconds)</Label>
                    <Input
                        type="number"
                        value={formData.duration?.toString() || ''}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            handleChange('duration', isNaN(val) ? 10 : val);
                        }}
                        required
                        placeholder="10"
                    />
                </div>
            )}

            <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                    value={formData.type || 'image'}
                    onValueChange={(v) => handleChange('type', v)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {
                formData.type === 'video' && (
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch
                            checked={formData.muted ?? true}
                            onCheckedChange={(c) => handleChange('muted', c)}
                        />
                        <Label>Mute Video</Label>
                    </div>
                )
            }

            <div className="grid gap-2">
                <Label>Order (Sort Priority)</Label>
                <Input
                    type="number"
                    value={formData.order?.toString() || ''}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        handleChange('order', isNaN(val) ? 0 : val);
                    }}
                    required
                />
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Switch
                    checked={formData.enabled}
                    onCheckedChange={(c) => handleChange('enabled', c)}
                />
                <Label>Enabled</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save Ad</Button>
            </div>
        </form >
    );
}
