// lib/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "./prisma"; // <-- named import (important)

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "30", 10);

// Warn in dev if JWT_SECRET is not set
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== "production") {
    console.warn("lib/auth: JWT_SECRET is not set. Using insecure dev fallback. Set JWT_SECRET in production.");
}

// create access token (JWT)
export function signAccessToken(user) {
    // minimal payload; keep small
    return jwt.sign({ sub: String(user.id), email: user.email }, JWT_SECRET, {
        expiresIn: ACCESS_EXP,
    });
}

// verify access token; returns payload or throws
export function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

// create refresh token (opaque random string) and persist hashed version in DB
export async function createRefreshToken(userId) {
    const tokenPlain = crypto.randomBytes(48).toString("hex");
    const tokenHash = await bcrypt.hash(tokenPlain, 10);

    const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 3600 * 1000);

    await prisma.refreshToken.create({
        data: {
            tokenHash,
            userId,
            expiresAt,
            revoked: false,
        },
    });

    return { token: tokenPlain, expiresAt };
}

// validate refresh token: returns DB record if valid; also returns the record id
export async function consumeRefreshToken(tokenPlain) {
    // Find non-revoked, unexpired tokens and compare
    const tokens = await prisma.refreshToken.findMany({
        where: { revoked: false, expiresAt: { gt: new Date() } },
    });

    for (const t of tokens) {
        const ok = await bcrypt.compare(tokenPlain, t.tokenHash);
        if (ok) {
            return t;
        }
    }
    return null;
}

// revoke a refresh token DB entry
export async function revokeRefreshToken(id) {
    return prisma.refreshToken.update({
        where: { id },
        data: { revoked: true },
    });
}
