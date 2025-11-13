// app/api/auth/refresh/route.js
import prisma from "@/lib/prisma";
import { consumeRefreshToken, revokeRefreshToken, signAccessToken, createRefreshToken } from "@/lib/auth";

const COOKIE_NAME = "refresh_token";

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach(function (cookie) {
    const parts = cookie.split("=");
    const key = parts.shift().trim();
    const value = decodeURI(parts.join("="));
    list[key] = value;
  });
  return list;
}

function setRefreshCookie(resHeaders, tokenPlain, expiresAt) {
  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  const cookie = `${COOKIE_NAME}=${tokenPlain}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict; Secure`;
  resHeaders.append("Set-Cookie", cookie);
}

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const tokenPlain = cookies[COOKIE_NAME];

    if (!tokenPlain) {
      return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401 });
    }

    const dbToken = await consumeRefreshToken(tokenPlain);
    if (!dbToken) {
      // possible stolen or expired token
      return new Response(JSON.stringify({ error: "Invalid refresh token" }), { status: 401 });
    }

    // rotate: revoke old and issue new
    await revokeRefreshToken(dbToken.id);

    const user = await prisma.user.findUnique({ where: { id: dbToken.userId } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 401 });
    }

    const accessToken = signAccessToken(user);
    const { token: nextRefreshPlain, expiresAt } = await createRefreshToken(user.id);

    const headers = new Headers();
    setRefreshCookie(headers, nextRefreshPlain, expiresAt);

    return new Response(JSON.stringify({ accessToken, user: { id: user.id, email: user.email, fullName: user.fullName } }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
