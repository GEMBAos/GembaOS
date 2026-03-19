import { supabase } from '../lib/supabase';

export interface UserStrength {
    name: string;
    endorsements: string[]; // Array of unique user IDs who have vouched for this
}

export interface UserProfile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    streak_count: number;
    best_streak_count?: number; // Optional for backward compatibility with DB
    last_active: string | null;
    rank: string;
    xp: number;
    role: string;
    strengths?: UserStrength[];
    linkedin_url?: string;
    contact_info?: string;
    network?: string; // e.g. Domain based grouping or "Out of Network"
    location?: string; // e.g. State or facility
    badges?: string[];
    daily_grid_progress?: string[];
    daily_grid_date?: string;
}

export const userService = {
    async getProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
        // SECURITY: Strip role updates. Roles must be managed via backend RLS or SuperAdmin portal.
        if ('role' in updates) {
            console.warn('Security Block: Client attempted to update role.');
            delete updates.role;
        }

        // If there are no other updates left in the object, return true
        if (Object.keys(updates).length === 0) return true;

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) {
            console.error('Error updating profile:', error);
            // Fallback for missing columns (e.g. linkedin_url, contact_info before migration)
            if (error.code === 'PGRST204' || error.message.includes('column')) {
                console.warn('Attempting fallback update with core fields only due to schema mismatch...');
                const coreUpdates = {
                    full_name: updates.full_name,
                    username: updates.username,
                    avatar_url: updates.avatar_url
                };
                
                // Remove undefined keys
                Object.keys(coreUpdates).forEach(key => 
                    coreUpdates[key as keyof typeof coreUpdates] === undefined && delete coreUpdates[key as keyof typeof coreUpdates]
                );

                if (Object.keys(coreUpdates).length > 0) {
                     const { error: fallbackError } = await supabase
                        .from('profiles')
                        .update(coreUpdates)
                        .eq('id', userId);
                        
                     if (!fallbackError) return true;
                }
            }
            return false;
        }
        return true;
    },

    async uploadAvatar(userId: string, file: File): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload the file to the 'avatars' bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                console.error('Avatar upload error:', uploadError);
                return null;
            }

            // Get the public URL
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            console.error('Unexpected error uploading avatar:', err);
            return null;
        }
    },

    async updateStreak(userId: string) {
        const profile = await this.getProfile(userId);
        if (!profile) return;

        const now = new Date();
        const lastActive = profile.last_active ? new Date(profile.last_active) : null;

        let newStreak = profile.streak_count;
        let diffHours = 0;

        if (!lastActive) {
            newStreak = 1;
        } else {
            diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

            if (diffHours < 24) {
                // Already active today, no change
            } else if (diffHours < 48) {
                // Active within 48 hours, increment streak
                newStreak += 1;
            } else {
                // Streak broken
                newStreak = 1;
            }
        }

        const bestStreak = Math.max(newStreak, profile.best_streak_count || 0);

        let xpGained = 0;
        // Only award daily XP once per 24 hour rolling period, or on first active
        if (!lastActive || diffHours >= 24) {
            xpGained = 20; // 20 XP for daily activity or streak continuation
        }

        // Try to update with best_streak_count, if it fails due to missing column, we fallback
        const updateData: any = {
            streak_count: newStreak,
            last_active: now.toISOString(),
            xp: profile.xp + xpGained // Gain XP for activity
        };

        const newRank = this.calculateRank(updateData.xp).title;
        if (newRank !== profile.rank) {
            updateData.rank = newRank;
        }

        // If best streak improved, try to save it
        if (bestStreak > (profile.best_streak_count || 0)) {
            updateData.best_streak_count = bestStreak;
        }

        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

        if (error) {
            console.error('Error updating streak:', error);
        }
    },

    calculateRank(xp: number): { title: string, level: number } {
        const levels = [
            { title: 'Spark', minXp: 0 },
            { title: 'Hunter', minXp: 500 },
            { title: 'Builder', minXp: 1500 },
            { title: 'Breaker', minXp: 3000 },
            { title: 'Legend', minXp: 5000 },
        ];

        let current = levels[0];
        for (const level of levels) {
            if (xp >= level.minXp) {
                current = level;
            } else {
                break;
            }
        }

        return { title: current.title, level: levels.indexOf(current) + 1 };
    },

    async addXP(userId: string, amount: number) {
        const profile = await this.getProfile(userId);
        if (!profile) return;
        
        const newXp = profile.xp + amount;
        const newRank = this.calculateRank(newXp).title;
        
        const updates: Partial<UserProfile> = { xp: newXp };
        if (newRank !== profile.rank) {
             updates.rank = newRank;
        }
        await this.updateProfile(userId, updates);
    },
    
    async awardBadge(userId: string, badgeId: string) {
        const profile = await this.getProfile(userId);
        if (!profile) return;
        
        const currentBadges = profile.badges || [];
        if (!currentBadges.includes(badgeId)) {
             const newBadges = [...currentBadges, badgeId];
             await this.updateProfile(userId, { badges: newBadges });
        }
    }
};
