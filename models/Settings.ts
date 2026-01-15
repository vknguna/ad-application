import mongoose, { Schema, Document, Model } from 'mongoose';



export interface ISettings extends Document {
    siteTitle: string;
    refreshInterval: number; // in seconds
    theme: 'light' | 'dark' | 'system';
    flashMode?: 'card' | 'screen';
}

const SettingsSchema: Schema = new Schema({
    siteTitle: { type: String, default: 'My Digital Signage' },
    refreshInterval: { type: Number, default: 60 },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    flashMode: { type: String, enum: ['card', 'screen'], default: 'card' },
}, { timestamps: true });

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
export default Settings;
