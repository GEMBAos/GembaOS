-- Database generation script for GembaOS Execution Hub

-- 1. Ensure profiles table has the necessary columns for gamification
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS best_streak_count integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS strengths jsonb DEFAULT '[]'::jsonb;

-- 2. Create Kaizen Projects Table
CREATE TABLE IF NOT EXISTS public.kaizen_projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    problem_statement text,
    goal_statement text,
    status text DEFAULT 'Active',
    team jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Kaizen Projects
ALTER TABLE public.kaizen_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
    ON public.kaizen_projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
    ON public.kaizen_projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON public.kaizen_projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON public.kaizen_projects FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Create Kaizen Actions Table
CREATE TABLE IF NOT EXISTS public.kaizen_actions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.kaizen_projects(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    owner text,
    status text DEFAULT 'To Do',
    difficulty text DEFAULT 'Medium',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Kaizen Actions
ALTER TABLE public.kaizen_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own actions"
    ON public.kaizen_actions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions"
    ON public.kaizen_actions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actions"
    ON public.kaizen_actions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own actions"
    ON public.kaizen_actions FOR DELETE
    USING (auth.uid() = user_id);

-- Note: We are consolidating Phases and Evidence into the Kaizen Project JSON for the MVP 
-- to match the existing localStorage data structure and allow for rapid iteration,
-- saving complex relational joins for phase 2.
ALTER TABLE public.kaizen_projects ADD COLUMN IF NOT EXISTS phases jsonb DEFAULT '[]'::jsonb;
