import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WorkOrderStatus } from '@prisma/client';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Explicitly set Node.js runtime

export async function GET() {
  try {
    // Get total trucks and assigned trucks
    const [totalTrucks, assignedTrucks] = await Promise.all([
      prisma.equipment.count({
        where: { type: 'TRUCK' }
      }),
      prisma.equipment.count({
        where: { 
          type: 'TRUCK',
          status: 'IN_USE'
        }
      })
    ]);

    // Get total technicians and assigned technicians
    const [totalTechnicians, assignedTechnicians] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'TECHNICIAN',
        }
      }),
      prisma.user.count({
        where: {
          role: 'TECHNICIAN',
          assignedOrders: {
            some: {
              status: { not: 'COMPLETED' }
            }
          }
        }
      })
    ]);

    // Calculate hours worked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayWorkOrders = await prisma.workOrder.findMany({
      where: {
        status: WorkOrderStatus.COMPLETED,
        endDate: {
          gte: today
        }
      },
      select: {
        startDate: true,
        endDate: true
      }
    });

    // Calculate total hours worked
    const hoursWorked = todayWorkOrders.reduce((total, order) => {
      if (!order.endDate) return total;
      const start = new Date(order.startDate);
      const end = new Date(order.endDate);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    return NextResponse.json({
      trucks: {
        total: totalTrucks,
        assigned: assignedTrucks,
        available: totalTrucks - assignedTrucks
      },
      technicians: {
        total: totalTechnicians,
        assigned: assignedTechnicians,
        available: totalTechnicians - assignedTechnicians
      },
      hoursWorked: Math.round(hoursWorked * 10) / 10 // Round to 1 decimal place
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
