import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';

export async function GET() {
    await dbConnect();
    const messages = await Message.find({});
    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    await dbConnect();
    const body = await request.json();
    const message = await Message.create(body);
    return NextResponse.json(message);
}
