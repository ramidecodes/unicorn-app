-- Change user_id column from uuid to varchar to support Clerk user IDs
ALTER TABLE "unicorns" ALTER COLUMN "user_id" TYPE varchar(255) USING "user_id"::text;



