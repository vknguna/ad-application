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
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
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
                <Label>Google Drive Link (URL)</Label>
                <Input
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    required
                    placeholder="https://drive.google.com/..."
                />
            </div>

            <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                    value={formData.type}
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

            <div className="grid gap-2">
                <Label>Order (Sort Priority)</Label>
                <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleChange('order', parseInt(e.target.value))}
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
        </form>
    );
}
