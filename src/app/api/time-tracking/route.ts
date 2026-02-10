import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth.server';
import { NextResponse } from 'next/server';
import { differenceInSeconds } from 'date-fns';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const activeSession = await prisma.timeEntry.findFirst({
    where: { userId: user.id, end: null },
  });

  const history = await prisma.timeEntry.findMany({
    where: { userId: user.id },
    orderBy: { start: 'desc' },
    take: 20,
  });

  return NextResponse.json({ activeSession, history });
}

export async function POST() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if session already active
  const existing = await prisma.timeEntry.findFirst({
    where: { userId: user.id, end: null },
  });

  if (existing) return NextResponse.json({ error: 'Session already active' }, { status: 400 });

  const session = await prisma.timeEntry.create({
    data: {
      userId: user.id,
      start: new Date(),
    }
  });

  return NextResponse.json(session);
}

export async function PATCH(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();

  const session = await prisma.timeEntry.findUnique({
    where: { id },
  });

  if (!session || session.userId !== user.id || session.end) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  const end = new Date();
  const duration = differenceInSeconds(end, session.start);

  const updated = await prisma.timeEntry.update({
    where: { id },
    data: {
      end,
      duration,
    }
  });

  return NextResponse.json(updated);
}
