CREATE TABLE IF NOT EXISTS "site_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"category" text NOT NULL,
	"alt" text NOT NULL,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_images_image_id_unique" UNIQUE("image_id")
);

-- Insert default activity images
INSERT INTO "site_images" ("image_id", "name", "description", "url", "category", "alt", "order") VALUES
('activity-1', '活動照片 1', '滑板活動現場照片', '/activity1.png', 'activity', '活動照片 1', 1),
('activity-2', '活動照片 2', '滑板活動現場照片', '/activity2.png', 'activity', '活動照片 2', 2),
('activity-3', '活動照片 3', '滑板活動現場照片', '/activity3.png', 'activity', '活動照片 3', 3)
ON CONFLICT ("image_id") DO NOTHING;