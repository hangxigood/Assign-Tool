/**
 * @fileoverview Individual equipment API route handler.
 * This file contains the implementation of API endpoint for retrieving detailed equipment information.
 * @package
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

/**
 * GET /api/equipments/[id]
 * @description Retrieves detailed information about a specific equipment
 * @param {Request} request - The incoming request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - The equipment ID
 * @throws {Error} If user is not authenticated or equipment not found
 * @returns {Promise<NextResponse>} JSON response containing equipment details or error
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: params.id },
      include: {
        currentLocation: true,
        workOrders: true,
        notes: {
          include: {
            user: true,
          },
        },
        documents: true,
      },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching equipment" },
      { status: 500 }
    );
  }
}
