import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { feedbackResponses } from "../../db/schema.js";

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

  const impressioneNum = Number(body.impressione);

  const [row] = await db
    .insert(feedbackResponses)
    .values({
      motivo: typeof body.motivo === "string" ? body.motivo : null,
      impressione: Number.isFinite(impressioneNum) ? impressioneNum : null,
      broken: typeof body.broken === "string" ? body.broken.slice(0, 2000) : null,
      wish: typeof body.wish === "string" ? body.wish.slice(0, 2000) : null,
      pagina: typeof body.pagina === "string" ? body.pagina.slice(0, 500) : null,
    })
    .returning();

  return Response.json({ success: true, id: row.id }, { status: 201 });
};

export const config: Config = {
  path: "/api/feedback",
};
