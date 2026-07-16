CREATE TABLE "feedback_responses" (
	"id" serial PRIMARY KEY,
	"motivo" text,
	"impressione" integer,
	"broken" text,
	"wish" text,
	"pagina" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "issue_reports" (
	"id" serial PRIMARY KEY,
	"request_type" text NOT NULL,
	"name" text NOT NULL,
	"project_name" text NOT NULL,
	"city" text NOT NULL,
	"category" text,
	"description" text NOT NULL,
	"email" text NOT NULL,
	"project_ref" text,
	"created_at" timestamp DEFAULT now()
);
