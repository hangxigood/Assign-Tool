import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// This tells Next.js this is a dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const roleParam = request.nextUrl.searchParams.get('role')?.toUpperCase();
    
    let role: UserRole | undefined;
    if (roleParam === 'TECHNICIANS') {
      role = UserRole.TECHNICIAN;
    } else if (roleParam === 'SUPERVISORS') {
      role = UserRole.SUPERVISOR;
    }

    const users = await prisma.user.findMany({
      where: role ? {
        role: role
      } : undefined,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
    
    // Format the response to include full name
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
