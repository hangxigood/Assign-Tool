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
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Received data:', data);
    
    // Validate required fields
    if (!data.startDate) {
      return NextResponse.json({ error: 'Start date is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format the date properly
    let formattedStartDate;
    try {
      // If the date includes time information, strip it
      const dateOnly = data.startDate.split('T')[0];
      formattedStartDate = new Date(dateOnly);
      
      // Validate the date is valid
      if (isNaN(formattedStartDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      // Set time to midnight UTC
      formattedStartDate = new Date(formattedStartDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    } catch (error) {
      console.error('Date parsing error:', error);
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    console.log('Formatted start date:', formattedStartDate.toISOString());

    const workOrder = await prisma.workOrder.create({
      data: {
        type: data.type,
        status: data.status || 'PENDING',
        fameNumber: data.fameNumber,
        clientName: data.clientName,
        clientContactName: data.clientContactName,
        clientPhone: data.clientPhone,
        startDate: formattedStartDate,
        startHour: data.startHour || '00:00',
        endHour: data.endHour || '00:00',
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

    console.log('Created work order:', {
      id: workOrder.id,
      startDate: workOrder.startDate,
      startHour: workOrder.startHour,
      endHour: workOrder.endHour
    });

    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    return NextResponse.json({ 
      error: 'Failed to create work order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
