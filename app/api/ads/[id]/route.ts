import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ad from '@/models/Ad';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const ad = await Ad.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(ad);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    await Ad.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
}
