CREATE TABLE IF NOT EXISTS "sects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pos" integer NOT NULL,
	"shp" text DEFAULT 'ic' NOT NULL,
	"crt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"upd_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sects_shp_chk" CHECK ("sects"."shp" IN ('ic', 'sq', 'plq')),
	CONSTRAINT "sects_pos_chk" CHECK ("sects"."pos" >= 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" text PRIMARY KEY NOT NULL,
	"sect_id" text NOT NULL,
	"pos" integer NOT NULL,
	"name" text NOT NULL,
	"dsc" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"img" text,
	"shp" text DEFAULT 'ic' NOT NULL,
	"crt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"upd_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "items_shp_chk" CHECK ("items"."shp"   IN ('ic', 'sq', 'plq')),
	CONSTRAINT "items_pos_chk" CHECK ("items"."pos"   >= 0),
	CONSTRAINT "items_price_chk" CHECK ("items"."price" >= 0)
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "items" ADD CONSTRAINT "items_sect_id_sects_id_fk"
    FOREIGN KEY ("sect_id") REFERENCES "public"."sects"("id")
    ON DELETE cascade ON UPDATE cascade;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sects_pos_idx" ON "sects" USING btree ("pos");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "items_sect_idx" ON "items" USING btree ("sect_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "items_ord_idx" ON "items" USING btree ("sect_id","pos");
