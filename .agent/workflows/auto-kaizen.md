---
description: Auto-Kaizen - The Perpetual Improvement Loop
---
# Auto-Kaizen Workflow

This workflow executes one cycle of the perpetual improvement loop for Kaizen Copilot. You are an autonomous software agent tasked with continuously improving this web application. This loop gives you the structure to evaluate the application, invent a new impactful feature or refactor, implement it, test it, and document it. 

Follow these steps exactly to complete one cycle:

1. **Analyze the Codebase**: 
   - Briefly review the `README.md` and check the `src/` directory (especially `src/components/` and `src/App.tsx`) to understand what exists. Look at `IMPROVEMENT_LOG.md` to see what changes have recently been made.

2. **Brainstorm (The "Kaizen")**:
   - Based on your analysis, invent **ONE single, specific, well-scoped improvement or feature**. This should be something that genuinely adds value or improves the code quality (e.g., adding a new graph type, optimizing state management, adding a new lean tool like a "5 Whys" interactive component, improving the dark mode aesthetics, expanding test coverage). 
   - *Never* suggest something that is too massive for a single iteration.
   - You MUST formulate this idea autonomously. Pick the best idea and proceed.

3. **Plan & Pitch**:
   - Write a short implementation plan in your head or in a temporary file detailing how you will build this single feature.
   - Use `notify_user` to present this one idea to the user and ask for the "Go" signal. Keep it extremely brief (max 2 sentences).
   - Wait for their approval. (If they reject it, go back to step 2).

4. **Execute**:
   - Once approved, switch to `EXECUTION` mode task boundary.
   - Write the required React components, CSS, or utility functions. Use the codebase's existing vanilla CSS styling rules (dark mode, premium aesthetic, etc.) and TypeScript conventions.
   - Ensure you wire the new component into the application (e.g., update `App.tsx` or a relevant dashboard view).

5. **Verify**:
   - Switch to `VERIFICATION` mode task boundary.
   - Run `npm run build` or `npm run lint` using the `run_command` tool to ensure your code has zero TypeScript/build errors. Fix any errors you introduce automatically.

6. **Log & Clean Up**:
   - Append a new section to the top of the history list in `IMPROVEMENT_LOG.md`. Specify the Date, the Feature Name, and a 1-2 sentence description of what you did. Use the following format:
     ```markdown
     ### [Date] - [Feature/Improvement Name]
     **Summary**: A concise description of what was changed and the value it provides.
     **Files Touched**: `src/foo.tsx`, `src/bar.ts`
     ```
   - Update `task.md` if necessary to show the loop iteration is complete.
   - Provide the final success notification to the user highlighting the newly shipped feature!
