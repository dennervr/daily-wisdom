CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"dayId" integer NOT NULL,
	"language" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"sources" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_dayId_language_unique" UNIQUE("dayId","language")
);
--> statement-breakpoint
CREATE TABLE "day" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"day" integer NOT NULL,
	CONSTRAINT "day_date_unique" UNIQUE("date")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_dayId_day_id_fk" FOREIGN KEY ("dayId") REFERENCES "public"."day"("id") ON DELETE cascade ON UPDATE no action;