import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { propertyId, amenityIds } = await req.json();

    if (!propertyId || !Array.isArray(amenityIds) || amenityIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: must include propertyId and a non-empty amenityIds array",
        },
        { status: 400 }
      );
    }

    // ✅ Create payload for Prisma
    const payload = amenityIds.map((amenityId) => ({
      propertyId: Number(propertyId),
      amenityId: Number(amenityId),
    }));

    // ✅ Bulk insert (skip duplicates automatically)
    const result = await prisma.propertyAmenity.createMany({
      data: payload,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} amenities linked successfully.`,
      payload, // 👀 Return the payload so you can inspect what was sent to Prisma
    });
  } catch (err) {
    console.error("Amenity link error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Property-Amenity API is running 🚀" });
}
