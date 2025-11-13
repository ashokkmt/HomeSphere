// app/api/auth/signup/route.js
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const isDev = process.env.NODE_ENV !== "production";

function jsonResponse(obj, status = 200, headers = {}) {
    return new Response(JSON.stringify(obj), {
        status,
        headers: { "Content-Type": "application/json", ...headers },
    });
}

export async function POST(req) {
    try {
        const body = await req.json();

        // Accept either raw payload or wrapped { formData: { ... } }
        const payload = body?.formData ? body.formData : body;

        const name = payload?.name || payload?.fullName || null;
        const email = payload?.email;
        const password = payload?.password;
        const roleRaw = payload?.role || "buyer";

        if (!email || !password) {
            return jsonResponse({ error: "Missing email or password" }, 400);
        }

        // normalize role to Prisma enum
        const roleMap = { buyer: "BUYER", agent: "AGENT", admin: "ADMIN" };
        const dbRole = roleMap[String(roleRaw).toLowerCase()] || "BUYER";

        // check existing
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return jsonResponse({ error: "Email already in use" }, 409);
        }

        // hash password
        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hash,
                fullName: name,
                role: dbRole,
            },
            select: { id: true, email: true, fullName: true, role: true },
        });

        // Return created user (no tokens). Frontend can call /api/auth/signin to get tokens
        return jsonResponse({ user }, 201);
    } catch (err) {
        console.error("Signup handler error:", err);
        if (isDev) {
            return jsonResponse({ error: "Internal Server Error", message: err.message, stack: err.stack }, 500);
        }
        return jsonResponse({ error: "Internal Server Error" }, 500);
    }
}
