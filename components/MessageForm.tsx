'use client';

import { useState, useEffect } from 'react';
import { IMessage } from '@/models/Message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface MessageFormProps {
    initialData?: IMessage;
    onSubmit: (data: Partial<IMessage>) => Promise<void>;
    onCancel: () => void;
}

export default function MessageForm({ initialData, onSubmit, onCancel }: MessageFormProps) {
    const [formData, setFormData] = useState<Partial<IMessage>>({
        name: '',
        text: '',
        enabled: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field: keyof IMessage, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
                <Label>Name (Identifier)</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="e.g. Welcome Message"
                />
            </div>

            <div className="grid gap-2">
                <Label>Message Text</Label>
                <Textarea
                    value={formData.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    required
                    placeholder="Enter the message to display..."
                    rows={4}
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
                <Button type="submit">Save Message</Button>
            </div>
        </form>
    );
}
