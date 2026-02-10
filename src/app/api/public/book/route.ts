import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const booking = await prisma.bookingRequest.create({
      data: {
        requesterName: data.requesterName,
        email: data.email,
        phone: data.phone,
        eventTitle: data.eventTitle,
        start: new Date(data.start),
        end: new Date(data.end),
        location: data.location,
        audienceSize: data.audienceSize,
        techNeedsCategories: JSON.stringify(data.techNeedsCategories),
        techNeedsText: data.techNeedsText,
        status: 'neu',
      }
    });

    return NextResponse.json({ success: true, id: booking.id });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
