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
        startDate: {
          gte: today
        }
      }
    });

    // Calculate hours worked this month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthWorkOrders = await prisma.workOrder.findMany({
      where: {
        status: WorkOrderStatus.COMPLETED,
        startDate: {
          gte: firstDayOfMonth
        }
      }
    });

    // Calculate total hours
    const calculateHours = (orders: any[]) => {
      return orders.reduce((total, order) => {
        const startHourParts = order.startHour.split(':');
        const endHourParts = order.endHour ? order.endHour.split(':') : null;
        
        if (!endHourParts) return total;
        
        const startMinutes = parseInt(startHourParts[0]) * 60 + parseInt(startHourParts[1]);
        const endMinutes = parseInt(endHourParts[0]) * 60 + parseInt(endHourParts[1]);
        
        const hours = (endMinutes - startMinutes) / 60;
        return total + (hours > 0 ? hours : 0);
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
    if (error instanceof Error) {
      console.error('Error fetching stats:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
