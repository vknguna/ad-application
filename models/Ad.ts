import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAd extends Document {
    title: string;
    url: string;
    type: 'image' | 'video';
    enabled: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const AdSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.Ad) {
    delete mongoose.models.Ad;
}

const Ad: Model<IAd> = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);

export default Ad;
