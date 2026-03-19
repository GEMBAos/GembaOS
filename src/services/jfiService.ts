import { supabase } from '../lib/supabase';
import type { JFIIdea } from '../data/jfiIdeas';

export interface JFISubmission {
    id: string;
    user_id: string | null;
    location_zone: string | null;
    category: string;
    title: string;
    description: string;
    impact_level: string;
    photo_url: string | null;
    created_at: string;
}

export const jfiService = {
    async submitJfi(idea: JFIIdea, locationZone: string, photoUrl: string | null, userId: string | null): Promise<boolean> {
        // Strip out any empty strings to null for cleaner db
        const cleanZone = locationZone.trim() === '' ? null : locationZone.trim();
        
        const payload = {
            user_id: userId,
            location_zone: cleanZone,
            category: idea.category,
            title: idea.title,
            description: idea.description,
            impact_level: idea.impactLevel,
            photo_url: photoUrl
        };

        const { error } = await supabase
            .from('jfi_submissions')
            .insert([payload]);

        if (error) {
            console.error('Failed to submit JFI to database:', error);
            return false;
        }

        return true;
    },

    async getAnalytics(): Promise<JFISubmission[]> {
        const { data, error } = await supabase
            .from('jfi_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch JFI analytics:', error);
            return [];
        }

        return data as JFISubmission[];
    }
};
