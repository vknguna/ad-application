import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    text: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        text: { type: String, required: true },
        enabled: { type: Boolean, default: true },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.Message) {
    delete mongoose.models.Message;
}

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
