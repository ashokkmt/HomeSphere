// lib/getCurrentUser.js (server)
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) return null;

        const payload = verifyAccessToken(token);
        const user = await prisma.user.findUnique({
            where: { id: parseInt(payload.sub, 10) },
            select: { id: true, email: true, fullName: true, phone: true, role: true },
        });
        return user;
    } catch (err) {
        console.warn("getCurrentUser error:", err?.message || err);
        return null;
    }
}
