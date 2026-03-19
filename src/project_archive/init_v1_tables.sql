-- GembaOS Persistence v1 Table Initialization
-- Run this in your Supabase SQL Editor

-- 1. Motion Sessions (Maps to MotionPath)
CREATE TABLE IF NOT EXISTS public.motion_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    operator_id TEXT NOT NULL,
    notes TEXT,
    path_coordinates JSONB DEFAULT '[]'::jsonb,
    total_distance NUMERIC DEFAULT 0,
    total_stops INTEGER DEFAULT 0,
    longest_segment NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Process Checks
CREATE TABLE IF NOT EXISTS public.process_checks (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    motion_session_id TEXT REFERENCES public.motion_sessions(id) ON DELETE SET NULL,
    process_name TEXT NOT NULL,
    operator_id TEXT NOT NULL,
    findings TEXT,
    waste_types JSONB DEFAULT '[]'::jsonb,
    target_cycle_time NUMERIC DEFAULT 0,
    actual_cycle_time NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Improvement Cards
CREATE TABLE IF NOT EXISTS public.improvement_cards (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    process_check_id TEXT REFERENCES public.process_checks(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    owner TEXT NOT NULL,
    status TEXT NOT NULL,
    countermeasure TEXT,
    before_condition TEXT,
    after_condition TEXT,
    expected_field_exits INTEGER DEFAULT 0,
    measured_field_exits INTEGER,
    expected_distance NUMERIC DEFAULT 0,
    measured_distance NUMERIC,
    next_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.motion_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_cards ENABLE ROW LEVEL SECURITY;

-- Create Policies for Motion Sessions
CREATE POLICY "Users can view their own motion sessions" ON public.motion_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own motion sessions" ON public.motion_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own motion sessions" ON public.motion_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own motion sessions" ON public.motion_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create Policies for Process Checks
CREATE POLICY "Users can view their own process checks" ON public.process_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own process checks" ON public.process_checks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own process checks" ON public.process_checks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own process checks" ON public.process_checks FOR DELETE USING (auth.uid() = user_id);

-- Create Policies for Improvement Cards
CREATE POLICY "Users can view their own improvement cards" ON public.improvement_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own improvement cards" ON public.improvement_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own improvement cards" ON public.improvement_cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own improvement cards" ON public.improvement_cards FOR DELETE USING (auth.uid() = user_id);
