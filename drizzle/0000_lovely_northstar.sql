CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"date" text NOT NULL,
	"category" text NOT NULL,
	"read_time" text NOT NULL,
	"author" text NOT NULL,
	"tags" json DEFAULT '[]'::json NOT NULL,
	"status" text DEFAULT '已發布' NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"cover_image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
