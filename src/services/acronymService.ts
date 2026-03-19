import { supabase } from '../lib/supabase';
import { userService } from './userService';

export interface Acronym {
    id: string;
    acronym: string;
    definition: string;
    context: string | null;
    submitted_by: string | null;
    created_at: string;
}

export const acronymService = {
    async getAcronyms(): Promise<Acronym[]> {
        const { data, error } = await supabase
            .from('acronyms')
            .select('*')
            .order('acronym', { ascending: true });

        if (error) {
            console.error('Error fetching acronyms:', error);
            // Fallback mock data if the table isn't created yet or we are offline
            if (error.code === 'PGRST116' || error.message.includes('relation "public.acronyms" does not exist')) {
                console.warn('Acronyms table not found. Returning local fallback data.');
                return getFallbackAcronyms();
            }
            return [];
        }

        // If table exists but is empty, we can return the fallback list to make it look full initially
        if (!data || data.length === 0) {
            return getFallbackAcronyms();
        }

        return data;
    },

    async submitAcronym(acronym: string, definition: string, context: string, userId: string | null): Promise<boolean> {
        const { error } = await supabase
            .from('acronyms')
            .insert([{
                acronym: acronym.toUpperCase(),
                definition,
                context,
                submitted_by: userId
            }]);

        if (error) {
            console.error('Error submitting acronym:', error);
            
            // If the table doesn't exist yet, we just simulate success for the demo environment
            if (error.code === 'PGRST116' || error.message.includes('relation "public.acronyms" does not exist')) {
                 console.warn('Simulating acronym submission due to missing table.');
                 if (userId) {
                    await userService.addXP(userId, 5);
                 }
                 return true;
            }
            return false;
        }

        // Award XP for contributing to the knowledge base
        if (userId) {
            await userService.addXP(userId, 5);
        }

        return true;
    }
};

function getFallbackAcronyms(): Acronym[] {
    return [
        { id: '1', acronym: '5S', definition: 'Sort, Set In order, Shine, Standardize, Sustain', context: 'Workplace organization methodology.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '2', acronym: 'JDI', definition: 'Just Do It', context: 'A bias for action on obvious, simple improvements without over-analysis.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '3', acronym: 'JFI', definition: 'Just Fix It', context: 'A GembaOS framework for rapidly capturing and solving daily friction.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '4', acronym: 'PDCA', definition: 'Plan, Do, Check, Act', context: 'Iterative four-step management method used in business for the control and continuous improvement of processes and products.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '5', acronym: 'SOP', definition: 'Standard Operating Procedure', context: 'A set of step-by-step instructions compiled by an organization to help workers carry out routine operations.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '6', acronym: 'WIP', definition: 'Work In Progress', context: 'A company\'s partially finished goods waiting for completion and eventual sale or the value of these items.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '7', acronym: 'TPM', definition: 'Total Productive Maintenance', context: 'A proactive approach to maintaining equipment that maximizes its operational time.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '8', acronym: 'OEE', definition: 'Overall Equipment Effectiveness', context: 'A metric that identifies the percentage of planned production time that is truly productive.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '9', acronym: 'SMED', definition: 'Single-Minute Exchange of Dies', context: 'A system for dramatically reducing the time it takes to complete equipment changeovers.', submitted_by: null, created_at: new Date().toISOString() },
        { id: '10', acronym: 'VSM', definition: 'Value Stream Mapping', context: 'A visualization tool to map the flow of materials and information in a process.', submitted_by: null, created_at: new Date().toISOString() }
    ];
}
