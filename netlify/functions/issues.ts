import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { issueReports } from "../../db/schema.js";

const REQUIRED_FIELDS = ["name", "project_name", "city", "description", "email"] as const;

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return Response.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const email = (body.email as string).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const [row] = await db
    .insert(issueReports)
    .values({
      requestType: body.request_type === "progetto" ? "progetto" : "segnalazione",
      name: (body.name as string).trim().slice(0, 200),
      projectName: (body.project_name as string).trim().slice(0, 300),
      city: (body.city as string).trim().slice(0, 200),
      category: typeof body.category === "string" ? body.category.trim().slice(0, 100) : null,
      description: (body.description as string).trim().slice(0, 5000),
      email,
      projectRef: typeof body.project_ref === "string" && body.project_ref ? body.project_ref.slice(0, 200) : null,
    })
    .returning();

  return Response.json({ success: true, id: row.id }, { status: 201 });
};

export const config: Config = {
  path: "/api/issues",
};
