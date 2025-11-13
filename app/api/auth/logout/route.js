// app/api/auth/logout/route.js
import { prisma } from "@/lib/prisma";
import { revokeRefreshToken } from "@/lib/auth";

const REFRESH_COOKIE_NAME = "refresh_token";
const ACCESS_COOKIE_NAME = "access_token";

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach(function (cookie) {
    const parts = cookie.split("=");
    const key = parts.shift().trim();
    const value = decodeURIComponent(parts.join("="));
    list[key] = value;
  });
  return list;
}

function cookieClearString(name) {
  // Keep Path=/, HttpOnly, SameSite the same as creation.
  const securePart = process.env.NODE_ENV === "production" ? "; Secure" : "";
  // Using SameSite=Lax is typical; adjust if you used Strict before.
  return `${name}=deleted; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${securePart}`;
}

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const tokenPlain = cookies[REFRESH_COOKIE_NAME];

    // Revoke the refresh token in DB if possible (compare hashed tokens)
    if (tokenPlain) {
      const tokens = await prisma.refreshToken.findMany({
        where: { revoked: false, expiresAt: { gt: new Date() } },
      });

      for (const t of tokens) {
        // bcryptjs compare
        const bcrypt = await import("bcryptjs");
        const ok = await bcrypt.compare(tokenPlain, t.tokenHash);
        if (ok) {
          await revokeRefreshToken(t.id);
          break;
        }
      }
    }

    // Clear both cookies (access + refresh). Use same attributes as created.
    const headers = new Headers();
    headers.append("Set-Cookie", cookieClearString(ACCESS_COOKIE_NAME));
    headers.append("Set-Cookie", cookieClearString(REFRESH_COOKIE_NAME));

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    console.error("Logout error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
