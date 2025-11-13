// app/api/auth/signin/route.js
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAccessToken, createRefreshToken } from "@/lib/auth";

const REFRESH_COOKIE_NAME = "refresh_token";
const ACCESS_COOKIE_NAME = "access_token";

// parse ACCESS_TOKEN_EXPIRY like "15m" or "900s" or a number of seconds string
function parseExpiryToSeconds(expStr, fallbackSec = 15 * 60) {
    if (!expStr) return fallbackSec;
    // "15m" => 900, "1h" => 3600, "900" => 900
    const m = String(expStr).trim();
    const num = parseInt(m, 10);
    if (!isNaN(num) && String(num) === m) return num; // plain seconds
    if (m.endsWith("s")) return parseInt(m.slice(0, -1), 10);
    if (m.endsWith("m")) return parseInt(m.slice(0, -1), 10) * 60;
    if (m.endsWith("h")) return parseInt(m.slice(0, -1), 10) * 3600;
    // fallback
    return fallbackSec;
}

function makeCookieString(name, value, maxAgeSec, httpOnly = true) {
    const securePart = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const httpOnlyPart = httpOnly ? "; HttpOnly" : "";
    // Use SameSite=Lax to allow typical navigation flows while mitigating CSRF
    return `${name}=${value}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${httpOnlyPart}${securePart}`;
}

function setRefreshCookie(headers, tokenPlain, expiresAt) {
    const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    headers.append("Set-Cookie", makeCookieString(REFRESH_COOKIE_NAME, tokenPlain, maxAge, true));
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body || {};

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // create tokens
        const accessToken = signAccessToken(user); // JWT
        const { token: refreshPlain, expiresAt } = await createRefreshToken(user.id);

        // compute cookie maxAge for access token from env or fallback to 15m
        const accessMaxAge = parseExpiryToSeconds(process.env.ACCESS_TOKEN_EXPIRY, 15 * 60);

        // set cookies
        const headers = new Headers();
        // access token cookie (HttpOnly, short-lived)
        headers.append("Set-Cookie", makeCookieString(ACCESS_COOKIE_NAME, accessToken, accessMaxAge, true));
        // refresh token cookie (HttpOnly, longer-lived)
        setRefreshCookie(headers, refreshPlain, expiresAt);

        // Return safe user info (do NOT return password or the access token if you want)
        // We return user object so client can show name/etc; client shouldn't store tokens in localStorage.
        const payload = {
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            // optionally include expiry time so client can know when token expires (not strictly necessary)
            accessTokenExpiresIn: accessMaxAge
        };

        return new Response(JSON.stringify(payload), {
            status: 200,
            headers,
        });
    } catch (err) {
        console.error("Signin handler error:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
