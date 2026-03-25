# GembaOS Development Rules: Anti-Regression Protocol

**CRITICAL DIRECTIVE**: The user has established a strict "No Backward Movement" policy. Do not sacrifice forward progress by unintentionally breaking existing functionality to achieve aesthetic updates.

When modifying this project, the AI must adhere to the following locked-in rules:

## 1. Zero-Collateral Damage on Layouts
- **Z-Index & Overlays**: Before applying global `position: absolute`, `position: fixed`, or `z-index` modifications (e.g. headers, splash screens, simulators), you MUST guarantee that they do not create invisible click-blocking layers (`pointer-events` absorption) over the main `.os-workspace` or `.os-nav-rail`.
- **CSS Grid Safety**: If making a grid item `height: auto` or adding large padding, ensure the underlying `grid-template-rows` is also `auto` so the visual block does not spill over its container boundaries and block underlying tools.

## 2. Lock-In Existing Scope
- The application currently has 15+ functional tools (Motion Mapper, Time Study, Value Scanner, 5S, Action Items, etc.). See `ui_functionality_checklist.md`.
- **DO NOT** delete these modules. 
- If the screen is getting too crowded (e.g., the Idea Engine taking up too much top header space), **DO NOT DEPRECATE THE TOOL**. Instead, **re-architect it** into its own dedicated routing view or module menu.

## 3. Responsive by Default
- Always respect the `.os-shell` mobile and desktop breakpoints. The persistent left-hand navigation rail is locked in and should never be pushed off screen or overlapped.

*(By adhering to this file, we ensure the user only experiences improvements on things that are bad, without breaking things that are currently good.)*
