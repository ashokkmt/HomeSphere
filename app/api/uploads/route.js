import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// 🧱 CHANGE THIS TO YOUR LOCAL STATIC FOLDER PATH
// const STATIC_FOLDER = "C:\\Users\\ashok\\OneDrive\\Desktop\\data\\2bhk & thara";

export const config = {
  api: {
    bodyParser: false, // required for form-data
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("images");
    const altTexts = formData.getAll("altTexts");
    const sortOrders = formData.getAll("sortOrders");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images uploaded" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "property");
    await mkdir(uploadDir, { recursive: true });

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const originalName = file.name.replace(/\s+/g, "_");
      const filename = `${Date.now()}-${originalName}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);

      const imageUrl = `/images/property/${filename}`;

      uploadedImages.push({
        url: imageUrl,
        altText: altTexts[i] || null,
        sortOrder: Number(sortOrders[i]) || i + 1,
      });
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
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
