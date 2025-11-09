import { prisma } from "@/lib/prisma";
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// 🧱 CHANGE THIS TO YOUR LOCAL STATIC FOLDER PATH
const STATIC_FOLDER = "C:\\Users\\ashok\\OneDrive\\Desktop\\data\\2bhk & thara";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid input: must be a non-empty array" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "property");
    await mkdir(uploadDir, { recursive: true });

    const insertedImages = [];

    for (let i = 0; i < body.length; i++) {
      const { propertyId, altText, sortOrder, fileName } = body[i];

      if (!propertyId || !fileName) {
        throw new Error("Missing propertyId or fileName in request.");
      }

      const sourcePath = path.join(STATIC_FOLDER, fileName);

      // generate unique name in public/images/property
      const filename = `${Date.now()}-${fileName}`;
      const destination = path.join(uploadDir, filename);

      await copyFile(sourcePath, destination);

      const imageUrl = `/images/property/${filename}`;

      const newImage = await prisma.propertyImage.create({
        data: {
          propertyId: Number(propertyId),
          url: imageUrl,
          altText: altText || null,
          sortOrder: sortOrder || i + 1,
        },
      });

      insertedImages.push(newImage);
    }

    return NextResponse.json({
      success: true,
      images: insertedImages,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Uploads API is running 🚀" });
}
