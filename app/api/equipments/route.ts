/**
 * @fileoverview Equipment API route handlers for CRUD operations.
 * This file contains the implementation of REST API endpoints for managing equipment.
 * @package
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

/**
 * GET /api/equipments
 * @description Retrieves a list of all equipment with their locations and work orders
 * @returns {Promise<NextResponse>} JSON response containing array of equipment or error
 */
export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({
      include: {
        currentLocation: true,
        workOrders: true,
      },
    });
    return NextResponse.json(equipments);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching equipments" }, { status: 500 });
  }
}

/**
 * POST /api/equipments
 * @description Creates a new equipment entry
 * @param {Request} request - The request object containing equipment data
 * @throws {Error} If user is not authenticated or data is invalid
 * @returns {Promise<NextResponse>} JSON response containing created equipment or error
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const equipment = await prisma.equipment.create({
      data: {
        name: json.name,
        type: json.type,
        status: json.status,
        licensePlate: json.licensePlate,
        serialNumber: json.serialNumber,
        description: json.description,
        locationId: json.locationId,
      },
    });
    return NextResponse.json(equipment);
  } catch (error) {
    return NextResponse.json({ error: "Error creating equipment" }, { status: 500 });
  }
}

/**
 * PUT /api/equipments
 * @description Updates an existing equipment entry
 * @param {Request} request - The request object containing updated equipment data
 * @throws {Error} If user is not authenticated or equipment not found
 * @returns {Promise<NextResponse>} JSON response containing updated equipment or error
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const equipment = await prisma.equipment.update({
      where: { id: json.id },
      data: {
        name: json.name,
        type: json.type,
        status: json.status,
        licensePlate: json.licensePlate,
        serialNumber: json.serialNumber,
        description: json.description,
        locationId: json.locationId,
      },
    });
    return NextResponse.json(equipment);
  } catch (error) {
    return NextResponse.json({ error: "Error updating equipment" }, { status: 500 });
  }
}

/**
 * DELETE /api/equipments
 * @description Deletes an equipment entry
 * @param {Request} request - The request object containing equipment ID in query params
 * @throws {Error} If user is not authenticated or equipment not found
 * @returns {Promise<NextResponse>} JSON response confirming deletion or error
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Equipment ID is required" }, { status: 400 });
    }

    await prisma.equipment.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting equipment" }, { status: 500 });
  }
}
