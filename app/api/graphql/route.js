import { NextResponse } from "next/server";
import { graphql } from "graphql";
import schema from "../../../lib/graphql/schema";

export async function POST(req) {
  const body = await req.json();
  const { query, variables } = body;

  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
  });

  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({ message: "GraphQL API is running 🚀" });
}
