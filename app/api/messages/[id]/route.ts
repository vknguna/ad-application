import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const message = await Message.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(message);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    await Message.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
}
