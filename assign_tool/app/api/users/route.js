import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const technicians = await prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(technicians);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch technicians' }, { status: 400 });
  }
}
