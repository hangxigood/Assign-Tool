import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { hasPermission } from "@/lib/permissions";

/**
 * Handles GET requests to retrieve work orders.
 */
export async function GET() {
  try {
    console.log('Fetching work orders...');
    const workOrders = await prisma.workOrder.findMany({
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        cancelledBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        equipment: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
    console.log('Work orders fetched:', workOrders);
    return NextResponse.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json({ error: 'Failed to fetch work orders' }, { status: 500 });
  }
}

/**
 * Handles POST requests to create new work orders.
 * 
 * @param request The incoming request object.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!hasPermission(session?.user?.role, 'create-work-orders')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Creating work order with data:', data);
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        type: data.type,
        status: data.status || 'PENDING',
        fameNumber: data.fameNumber,
        clientName: data.clientName,
        clientContactName: data.clientContactName,
        clientPhone: data.clientPhone,
        startDate: new Date(data.startDate),
        startHour: data.startHour,
        endHour: data.endHour,
        location: data.location,
        noteText: data.noteText,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log('Work order created:', workOrder);
    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 });
  }
}
