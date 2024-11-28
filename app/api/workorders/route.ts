import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * Handles GET requests to retrieve work orders.
 */
export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        supervisor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
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
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in to create a work order' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Crear el work order con los datos procesados
    const workOrder = await prisma.workOrder.create({
      data: {
        type: data.type,
        fameNumber: data.fameNumber,
        clientName: data.clientName,
        clientContactName: data.clientContactName,
        clientPhone: data.clientPhone,
        startDate: new Date(data.startDate),
        startHour: data.startHour,
        endHour: data.endHour || null,
        location: data.location,
        noteText: data.noteText || null,
        documentUrl: data.documentUrl || null,
        assignedToId: data.assignedToId,
        supervisorId: data.supervisorId,
        createdById: session.user.id,
        status: 'PENDING',
      },
    });
    
    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    return NextResponse.json(
      { error: 'Failed to create work order', details: error }, 
      { status: 500 }
    );
  }
}
