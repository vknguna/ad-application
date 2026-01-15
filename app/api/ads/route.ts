import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ad from '@/models/Ad';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();
    const ads = await Ad.find({}).sort({ order: 1 });
    return NextResponse.json(ads);
}

export async function POST(request: Request) {
    await dbConnect();
    const body = await request.json();
    const ad = await Ad.create(body);
    return NextResponse.json(ad);
}
