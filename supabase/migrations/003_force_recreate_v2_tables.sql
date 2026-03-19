-- 003_force_recreate_v2_tables.sql
-- Run this in your Supabase SQL Editor to fix the 400 Bad Request error.
-- This drops the existing tables (which likely have UUID types that conflict with our TEXT IDs)
-- and recreates them strictly with TEXT identifiers.

DROP TABLE IF EXISTS public.motion_paths_v2 CASCADE;
DROP TABLE IF EXISTS public.motion_sessions_v2 CASCADE;

-- 1. Motion Sessions V2
CREATE TABLE public.motion_sessions_v2 (
    id TEXT PRIMARY KEY,
    host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    layout_image_url TEXT,
    calibration_scale NUMERIC DEFAULT 1,
    calibration_unit TEXT DEFAULT 'none',
    status TEXT DEFAULT 'ACTIVE',
    access_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Motion Paths V2
CREATE TABLE public.motion_paths_v2 (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES public.motion_sessions_v2(id) ON DELETE CASCADE,
    participant_id TEXT NOT NULL,
    participant_name TEXT NOT NULL,
    color TEXT NOT NULL,
    path_points_json JSONB DEFAULT '[]'::jsonb,
    total_distance NUMERIC DEFAULT 0,
    total_stops INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.motion_sessions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_paths_v2 ENABLE ROW LEVEL SECURITY;

-- Host can do everything with their sessions
CREATE POLICY "Hosts can manage their sessions" ON public.motion_sessions_v2 FOR ALL USING (auth.uid() = host_user_id);
-- Anyone can view a session if they have the ID (for QR join)
CREATE POLICY "Anyone can view active sessions" ON public.motion_sessions_v2 FOR SELECT USING (true);

-- Anyone can insert/update/view paths in a session (Anon / Guest access for participants)
CREATE POLICY "Anyone can insert paths" ON public.motion_paths_v2 FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update paths" ON public.motion_paths_v2 FOR UPDATE USING (true);
CREATE POLICY "Anyone can view paths" ON public.motion_paths_v2 FOR SELECT USING (true);
