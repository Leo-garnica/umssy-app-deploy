-- Align with the shared project's multi-CV definition while preserving this
-- deploy's already-existing profile_skill_processing_states migration.
-- The shared 20261023190348 migration also creates that table and cannot be
-- replayed here without discarding the deploy's independent migration history.
DROP INDEX IF EXISTS "user_cv_file_user_id_key";
CREATE INDEX IF NOT EXISTS "user_cv_file_user_id_idx" ON "user_cv_file"("user_id");
