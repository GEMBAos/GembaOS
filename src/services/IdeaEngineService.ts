import { JFI_IDEAS, type JFIIdea } from '../data/jfiIdeas';

export class IdeaEngineService {
    /**
     * Semantically filters the JFI Master Library based on a user's text description.
     * Uses a heuristic keyword scoring system. Returns top 3 matches or fills with random.
     */
    static analyzeProblemDescription(description: string): JFIIdea[] {
        const text = description.toLowerCase().trim();
        
        // If empty, return 3 random ideas
        if (!text) {
            return this.getMultipleRandomIdeas(3);
        }

        // Expanded stop words list
        const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'in', 'a', 'an', 'and', 'or', 'to', 'for', 'of', 'with', 'my', 'it', 'we', 'i', 'this', 'that', 'but', 'are', 'was', 'were', 'have', 'has']);
        
        // Extract meaningful keywords from the description
        const keywords = text.split(/\s+/)
            .map(word => word.replace(/[^a-z0-9]/g, ''))
            .filter(word => word.length > 2 && !stopWords.has(word));

        if (keywords.length === 0) {
            return this.getMultipleRandomIdeas(3);
        }

        // Score every idea in the library against the keywords
        const scoredIdeas = JFI_IDEAS.map(idea => {
            let score = 0;
            const ideaTitle = idea.title.toLowerCase();
            const ideaDesc = idea.description.toLowerCase();
            const ideaCat = idea.category.toLowerCase();

            for (const kw of keywords) {
                if (new RegExp(`\\b${kw}\\b`).test(ideaTitle)) score += 5;
                else if (ideaTitle.includes(kw)) score += 2;

                if (new RegExp(`\\b${kw}\\b`).test(ideaDesc)) score += 3;
                else if (ideaDesc.includes(kw)) score += 1;

                if (ideaCat.includes(kw)) score += 4;
            }
            return { idea, score };
        });

        // Sort descending by score
        scoredIdeas.sort((a, b) => b.score - a.score);

        const bestMatches = scoredIdeas.filter(item => item.score > 0).map(item => item.idea);

        // Fill up to 3 if we don't have enough semantic matches
        const finalIdeas = [...bestMatches];
        while (finalIdeas.length < 3) {
            const random = this.getRandomIdea();
            if (!finalIdeas.find(i => i.title === random.title)) {
                finalIdeas.push(random);
            }
        }

        return finalIdeas.slice(0, 3);
    }

    /**
     * Simulated Vision API hook. Right now it just passes through to the text analyzer.
     */
    static async analyzePhotoWithContext(_imageFile: File, userDescription: string): Promise<JFIIdea[]> {
        // Artificial delay to simulate processing time, establishing the AI pacing UX
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        return this.analyzeProblemDescription(userDescription);
    }
    
    static getRandomIdea(): JFIIdea {
        return JFI_IDEAS[Math.floor(Math.random() * JFI_IDEAS.length)];
    }

    static getMultipleRandomIdeas(count: number): JFIIdea[] {
        const results: JFIIdea[] = [];
        const maxAttempts = count * 3;
        let attempts = 0;
        
        while (results.length < count && attempts < maxAttempts) {
            const idea = this.getRandomIdea();
            if (!results.find(i => i.title === idea.title)) {
                results.push(idea);
            }
            attempts++;
        }
        return results;
    }
}
