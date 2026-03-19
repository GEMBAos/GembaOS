-- 004_fix_host_user_id_type.sql
-- Run this in your Supabase SQL Editor to fix the 400 Bad Request error for guest users.
-- This drops the foreign key constraint that requires host_user_id to be a valid auth.users UUID,
-- and changes the column type to TEXT so we can pass "guest" during testing.

ALTER TABLE public.motion_sessions_v2 
  DROP CONSTRAINT IF EXISTS motion_sessions_v2_host_user_id_fkey;

ALTER TABLE public.motion_sessions_v2 
  ALTER COLUMN host_user_id TYPE TEXT USING host_user_id::text;
