import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WorkOrderStatus } from '@prisma/client';

export async function GET() {
  try {
    // Get total trucks and assigned trucks
    const totalTrucks = await prisma.equipment.count({
      where: { type: 'TRUCK' }
    });
    const assignedTrucks = await prisma.equipment.count({
      where: { 
        type: 'TRUCK',
        status: 'IN_USE'
      }
    });

    // Get total technicians and assigned technicians
    const totalTechnicians = await prisma.user.count({
      where: {
        role: 'TECHNICIAN',
      }
    });
    // Debug: First check for any IN_PROGRESS work orders
    const inProgressOrders = await prisma.workOrder.findMany({
      where: {
        status: 'IN_PROGRESS'
      },
      include: {
        assignedTo: true
      }
    });
    console.log('IN_PROGRESS work orders:', inProgressOrders);
    const assignedTechnicians = await prisma.user.count({
      where: {
        role: 'TECHNICIAN',
        assignedOrders: {
          some: {
            status: { not: 'COMPLETED' }
          }
        }
      }
    });

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

    // Calculate hours worked this month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthWorkOrders = await prisma.workOrder.findMany({
      where: {
        status: WorkOrderStatus.COMPLETED,
        endDate: {
          gte: firstDayOfMonth
        }
      },
      select: {
        startDate: true,
        endDate: true
      }
    });

    // Calculate total hours
    const calculateHours = (orders: { startDate: Date, endDate: Date | null }[]) => {
      return orders.reduce((total: number, order: { startDate: Date, endDate: Date | null }) => {
        // Add a null check
        if (order.endDate) {
          const hours = (new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60);
          return total + hours;
        }
        return total;
      }, 0);
    };

    const hoursToday = Math.round(calculateHours(todayWorkOrders));
    const hoursThisMonth = Math.round(calculateHours(monthWorkOrders));

    return NextResponse.json({
      trucks: `${assignedTrucks}/${totalTrucks}`,
      technicians: `${assignedTechnicians}/${totalTechnicians}`,
      hoursToday,
      hoursThisMonth
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
