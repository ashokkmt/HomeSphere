// server/graphql/context.js
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

export async function buildContext({ req, res }) {
  let userId = null;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      userId = parseInt(payload.sub, 10);
    } catch (err) {
      // token invalid or expired -> userId stays null
    }
  }

  return { prisma, req, res, userId };
}
