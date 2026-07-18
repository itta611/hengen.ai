DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'user'
			AND column_name = 'creditQuota'
	) THEN
		ALTER TABLE "user" ALTER COLUMN "creditQuota" SET DEFAULT 40;
	END IF;
END $$;
