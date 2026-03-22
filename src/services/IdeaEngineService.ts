import { JFI_IDEAS, type JFIIdea } from '../data/jfiIdeas';

export class IdeaEngineService {
    /**
     * Semantically filters the JFI Master Library based on a user's text description.
     * Uses a heuristic keyword scoring system. If no matches exceed the threshold, 
     * it falls back to a random idea to ensure the user always receives inspiration.
     */
    static analyzeProblemDescription(description: string): JFIIdea {
        const text = description.toLowerCase().trim();
        
        // If empty, return a truly random idea
        if (!text) {
            return this.getRandomIdea();
        }

        // Expanded stop words list
        const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'in', 'a', 'an', 'and', 'or', 'to', 'for', 'of', 'with', 'my', 'it', 'we', 'i', 'this', 'that', 'but', 'are', 'was', 'were', 'have', 'has']);
        
        // Extract meaningful keywords from the description
        const keywords = text.split(/\s+/)
            .map(word => word.replace(/[^a-z0-9]/g, ''))
            .filter(word => word.length > 2 && !stopWords.has(word));

        if (keywords.length === 0) {
            return this.getRandomIdea();
        }

        let bestMatch: JFIIdea | null = null;
        let highestScore = 0;

        // Score every idea in the library against the keywords
        for (const idea of JFI_IDEAS) {
            let score = 0;
            const ideaTitle = idea.title.toLowerCase();
            const ideaDesc = idea.description.toLowerCase();
            const ideaCat = idea.category.toLowerCase();

            for (const kw of keywords) {
                // Exact word match in title is heavily weighted
                if (new RegExp(`\\b${kw}\\b`).test(ideaTitle)) score += 5;
                // Partial match in title
                else if (ideaTitle.includes(kw)) score += 2;

                // Exact word match in description
                if (new RegExp(`\\b${kw}\\b`).test(ideaDesc)) score += 3;
                // Partial match in description
                else if (ideaDesc.includes(kw)) score += 1;

                // Match against category
                if (ideaCat.includes(kw)) score += 4;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = idea;
            }
        }

        // If a meaningful match was found (score > 2), return it. Otherwise, random.
        return (bestMatch && highestScore > 2) ? bestMatch : this.getRandomIdea();
    }

    /**
     * Simulated Vision API hook. Right now it just passes through to the text analyzer.
     * When an OpenAI/Gemini key is added to .env, this function will convert the 
     * File to Base64 and execute a prompt against the multimodal endpoint.
     */
    static async analyzePhotoWithContext(_imageFile: File, userDescription: string): Promise<JFIIdea> {
        // Artificial delay to simulate processing time, establishing the AI pacing UX
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        // For now, rely on the strict text semantic parser, or return random if both are empty
        return this.analyzeProblemDescription(userDescription);
    }
    
    static getRandomIdea(): JFIIdea {
        return JFI_IDEAS[Math.floor(Math.random() * JFI_IDEAS.length)];
    }
}
