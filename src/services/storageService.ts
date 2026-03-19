import { supabase } from '../lib/supabase';
import type { KaizenProject, ActionItem, KamishibaiCard } from '../types';
import { ImprovementEngine } from './ImprovementEngine';

// Keys are now dynamic based on user
const getKeys = (userId: string) => ({
    projects: `kaizen_projects_v1_${userId}`,
    actions: `kaizen_actions_v1_${userId}`,
    kamishibai: `kaizen_kamishibai_v1_${userId}`,
    news: `kaizen_news_v1_${userId}`,
    signage: `kaizen_signage_v1_${userId}`
});

// Helper to get current user ID transparently
const getUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id;
};

export const storageService = {
    currentUserId: 'guest',

    setUserId: (id: string | null) => {
        storageService.currentUserId = id || 'guest';
    },

    // --- LOCAL GETTERS (Synchronous for immediate UI rendering) ---
    getProjects: (): KaizenProject[] => {
        try {
            const data = localStorage.getItem(getKeys(storageService.currentUserId).projects);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    getActionItems: (projectId?: string): ActionItem[] => {
        try {
            const data = localStorage.getItem(getKeys(storageService.currentUserId).actions);
            let actions: ActionItem[] = data ? JSON.parse(data) : [];
            if (projectId) {
                actions = actions.filter(a => a.projectId === projectId);
            }
            return actions;
        } catch {
            return [];
        }
    },

    getKamishibaiCards: (): KamishibaiCard[] => {
        try {
            const data = localStorage.getItem(getKeys(storageService.currentUserId).kamishibai);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    getGlobalNews: (): any[] => {
        try {
            const data = localStorage.getItem(getKeys(storageService.currentUserId).news);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    getSignageAssets: (): any[] => {
        try {
            const data = localStorage.getItem(getKeys(storageService.currentUserId).signage);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    // --- CLOUD SYNC (Run on app load) ---
    syncFromCloud: async () => {
        const userId = await getUserId();
        if (!userId) return;

        // Fetch Projects
        const { data: projectsData, error: projError } = await supabase
            .from('kaizen_projects')
            .select('*')
            .eq('user_id', userId);

        if (!projError && projectsData) {
            storageService.setUserId(userId);

            const mappedProjects: KaizenProject[] = projectsData.map(row => ({
                id: row.id,
                name: row.name,
                problemStatement: row.problem_statement,
                goalStatement: row.goal_statement,
                status: row.status,
                team: row.team || [],
                phases: row.phases || [],
                createdAt: new Date(row.created_at).getTime(),
                updatedAt: new Date(row.updated_at).getTime()
            }));
            localStorage.setItem(getKeys(storageService.currentUserId).projects, JSON.stringify(mappedProjects));
        }

        // Fetch Actions
        const { data: actionsData, error: actError } = await supabase
            .from('kaizen_actions')
            .select('*')
            .eq('user_id', userId);

        if (!actError && actionsData) {
            const mappedActions: ActionItem[] = actionsData.map(row => ({
                id: row.id,
                projectId: row.project_id,
                title: row.title,
                description: row.description || '',
                owner: row.owner,
                status: row.status,
                difficulty: row.difficulty,
                createdAt: new Date(row.created_at).getTime()
            }));
            localStorage.setItem(getKeys(storageService.currentUserId).actions, JSON.stringify(mappedActions));
        }

        // Fetch Kamishibai
        const { data: kamiData, error: kamiError } = await supabase
            .from('kamishibai_cards')
            .select('*')
            .eq('user_id', userId);

        if (!kamiError && kamiData) {
            const mappedKami: KamishibaiCard[] = kamiData.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description || '',
                frequency: row.frequency,
                status: row.status,
                lastAudited: row.last_audited
            }));
            localStorage.setItem(getKeys(storageService.currentUserId).kamishibai, JSON.stringify(mappedKami));
        }

        // Fetch Global News
        const { data: newsData, error: newsError } = await supabase
            .from('global_news')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        if (!newsError && newsData) {
            localStorage.setItem(getKeys(storageService.currentUserId).news, JSON.stringify(newsData));
        }

        // Fetch Signage Assets
        const { data: signageData, error: signageError } = await supabase
            .from('signage_assets')
            .select('*');
        if (!signageError && signageData) {
            localStorage.setItem(getKeys(storageService.currentUserId).signage, JSON.stringify(signageData));
        }

        // Sync Core Operational Loop Data
        await ImprovementEngine.syncFromCloud();

        // Notify UI of fresh cloud data
        window.dispatchEvent(new Event('kaizen_data_updated'));
    },

    // --- MUTATIONS (Optimistic Local + Async Cloud) ---
    saveProject: async (project: KaizenProject) => {
        // 1. Optimistic Local Update
        const projects = storageService.getProjects();
        const existingIndex = projects.findIndex(p => p.id === project.id);
        project.updatedAt = Date.now();

        if (existingIndex >= 0) {
            projects[existingIndex] = project;
        } else {
            projects.push(project);
        }
        localStorage.setItem(getKeys(storageService.currentUserId).projects, JSON.stringify(projects));
        window.dispatchEvent(new Event('kaizen_data_updated')); // Instant UI feedback

        // 2. Async Cloud Push
        const userId = await getUserId();
        if (userId) {
            const dbPayload = {
                id: project.id,
                user_id: userId,
                name: project.name,
                problem_statement: project.problemStatement,
                goal_statement: project.goalStatement,
                status: project.status,
                team: project.team,
                phases: project.phases,
                updated_at: new Date(project.updatedAt).toISOString()
            };
            await supabase.from('kaizen_projects').upsert(dbPayload);
        }
        return project;
    },

    deleteProject: async (id: string) => {
        // Optimistic
        const projects = storageService.getProjects().filter(p => p.id !== id);
        localStorage.setItem(getKeys(storageService.currentUserId).projects, JSON.stringify(projects));

        // Cascade delete actions locally
        const actions = storageService.getActionItems().filter(a => a.projectId !== id);
        localStorage.setItem(getKeys(storageService.currentUserId).actions, JSON.stringify(actions));

        window.dispatchEvent(new Event('kaizen_data_updated'));

        // Cloud Push (Cloud cascade will handle actions via foreign key ON DELETE CASCADE)
        const userId = await getUserId();
        if (userId) {
            await supabase.from('kaizen_projects').delete().eq('id', id).eq('user_id', userId);
        }
    },

    saveActionItem: async (action: ActionItem) => {
        const actions = storageService.getActionItems();
        const existingIndex = actions.findIndex(a => a.id === action.id);

        if (existingIndex >= 0) {
            actions[existingIndex] = action;
        } else {
            actions.push(action);
        }
        localStorage.setItem(getKeys(storageService.currentUserId).actions, JSON.stringify(actions));
        window.dispatchEvent(new Event('kaizen_data_updated'));

        const userId = await getUserId();
        if (userId) {
            const dbPayload = {
                id: action.id,
                project_id: action.projectId,
                user_id: userId,
                title: action.title,
                description: action.description,
                owner: action.owner,
                status: action.status,
                difficulty: action.difficulty
            };
            await supabase.from('kaizen_actions').upsert(dbPayload);
        }
        return action;
    },

    deleteActionItem: async (id: string) => {
        const actions = storageService.getActionItems().filter(a => a.id !== id);
        localStorage.setItem(getKeys(storageService.currentUserId).actions, JSON.stringify(actions));
        window.dispatchEvent(new Event('kaizen_data_updated'));

        const userId = await getUserId();
        if (userId) {
            await supabase.from('kaizen_actions').delete().eq('id', id).eq('user_id', userId);
        }
    },

    saveKamishibaiCard: async (card: KamishibaiCard) => {
        const cards = storageService.getKamishibaiCards();
        const existingIndex = cards.findIndex(c => c.id === card.id);

        if (existingIndex >= 0) {
            cards[existingIndex] = card;
        } else {
            cards.push(card);
        }
        localStorage.setItem(getKeys(storageService.currentUserId).kamishibai, JSON.stringify(cards));
        window.dispatchEvent(new Event('kaizen_data_updated'));

        const userId = await getUserId();
        if (userId) {
            const dbPayload = {
                id: card.id,
                user_id: userId,
                title: card.title,
                description: card.description,
                frequency: card.frequency,
                status: card.status,
                last_audited: card.lastAudited || new Date().toISOString()
            };
            await supabase.from('kamishibai_cards').upsert(dbPayload);
        }
        return card;
    },

    deleteKamishibaiCard: async (id: string) => {
        const cards = storageService.getKamishibaiCards().filter(c => c.id !== id);
        localStorage.setItem(getKeys(storageService.currentUserId).kamishibai, JSON.stringify(cards));
        window.dispatchEvent(new Event('kaizen_data_updated'));

        const userId = await getUserId();
        if (userId) {
            await supabase.from('kamishibai_cards').delete().eq('id', id).eq('user_id', userId);
        }
    },

    // --- MULTIMEDIA UPLOADS ---
    uploadJFIPhoto: async (file: File): Promise<string | null> => {
        const userId = await getUserId();
        
        // If guest mode, just return a local object URL to maintain the UX loop
        if (!userId) {
            return URL.createObjectURL(file);
        }

        try {
            const fileExt = file.name.split('.').pop();
            // Create a unique filename incorporating the user ID and timestamp
            const fileName = `${userId}/${Date.now()}_jfi.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('jfi_uploads')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.warn('Storage bucket jfi_uploads might not exist or lacks RLS permissions. Falling back to local URL.', uploadError);
                return URL.createObjectURL(file);
            }

            const { data } = supabase.storage.from('jfi_uploads').getPublicUrl(fileName);
            return data.publicUrl;
        } catch (err) {
            console.error('Failed to upload JFI photo:', err);
            return URL.createObjectURL(file); // Graceful fallback
        }
    },

    // --- SEED DATA (Only runs for unauthenticated / first time local usage) ---
    seedDemoDataIfNeeded: () => {
        if (storageService.getProjects().length === 0) {
            const demoProject: KaizenProject = {
                id: 'demo-proj-1',
                name: 'Assembly Line 3 Flow Optimization',
                problemStatement: 'Operators are walking 45 minutes a day to retrieve parts from the back racks.',
                goalStatement: 'Reduce walk time to under 10 minutes by implementing point-of-use supermarkets.',
                status: 'Active',
                phases: [],
                team: ['Lean Manager', 'Line Lead'],
                createdAt: Date.now() - 86400000,
                updatedAt: Date.now()
            };
            // Use fire-and-forget for local seeding
            storageService.saveProject(demoProject);

            storageService.saveActionItem({
                id: 'demo-act-1',
                projectId: 'demo-proj-1',
                title: 'Design Flow Rack Layout',
                description: 'Map out the sizing for the new bins.',
                owner: 'Engineering',
                status: 'Done',
                difficulty: 'Medium',
                createdAt: Date.now() - 40000000
            });

            storageService.saveActionItem({
                id: 'demo-act-2',
                projectId: 'demo-proj-1',
                title: 'Move Racks to Line',
                owner: 'Maintenance',
                status: 'Doing',
                difficulty: 'Hard',
                createdAt: Date.now() - 10000000
            });
        }
    }
};
