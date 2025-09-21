# Development Changelog for The Neurodivergent Tree

## Version 0.3 (System Refactoring & UI Polish) - Circa October 2023

- **[Refactor]** The "Rest" layer's upgrade system was completely refactored from the legacy `upgrades` object to the modern `grid` system. This provides a robust foundation for the dynamic upgrade parrilla planned in the roadmap.
- **[Feature]** Implemented the first two Nivel 1 upgrades in the new `grid`:
    - **Recuperación Constante:** Regenerates 1 Spoon for every 150 SIP gained.
    - **Mayor Resiliencia:** Increases max Spoons by 1 and grants 1 Spoon instantly on purchase.
- **[Refactor]** The "Burnout" layer's UI was refactored to use the engine's native `milestones` system instead of a manual `raw-html` implementation, resulting in cleaner code and better performance.
- **[UI/UX]** Implemented a permanent visibility feature for the "Burnout" layer. Once unlocked, the layer remains visible, and its icon color dynamically changes to indicate if the Burnout state is active (red) or inactive (grey).
- **[UI/UX]** Corrected the styling of the Burnout milestones to properly display the currently active level without visual glitches or color conflicts.
- **[Bugfix]** After a deep and challenging debugging process, the `doPopup` function was correctly implemented to provide clear, visible feedback for the "Recuperación Constante" upgrade.

---

## Version 0.2 (Deep Burnout Mechanics) - Circa October 2023

- **[Hito]** Completed the **Deep Burnout** system, transforming it into a core game mechanic.
- **[Layer]** Added a new informational side-layer, "Burnout" (B), which only appears when the player is in the Burnout state.
- **[Mechanic]** Implemented a dynamic, multi-level Burnout system with escalating penalties:
    -   **Level 1: Agotamiento (≤ 0 Spoons):** SIP gain reduced by 50%, 'Rest' cost is doubled.
    -   **Level 2: Fatiga Crónica (≤ -10 Spoons):** SIP gain reduction increases to 75%, 'Mindful Breathing' regeneration is halved.
    -   **Level 3: Colapso (≤ -50 Spoons):** 'Mindful Breathing' regeneration stops completely, and the cost of the 'Sleep' ability increases.
- **[UI]** The "Burnout" tab now clearly displays all levels and their penalties, dynamically highlighting the player's current level.
- **[UI]** Added a glowing effect to the "Burnout" layer button to increase its visibility when active.

---

## Version 0.1 (Initial Prototype & Core Mechanics) - Circa October 2023

This log documents the initial, often challenging, development phase of the game, capturing the core ideas and the process of stabilizing the engine.

### Core Concept & Initial Implementation

- **[Idea]** Conceptualized a game based on the Spoon Theory to simulate the experience of managing daily energy for neurodivergent individuals.
- **[Mechanic]** Established the primary resource, "Social Interactions" (SIP), and the limiting resource, "Spoons".
- **[Mechanic]** Implemented the core consumption loop: gaining SIP consumes Spoons at a defined rate (100:1).
- **[Layer]** Created the first prestige layer, "Rest" (Symbol: R), allowing players to reset SIP to gain "Rest Points" (RP).

### The Great Bugs & Engine Stabilization

This period was marked by a significant and persistent bug where the core Spoon consumption mechanic would intermittently fail. The debugging process was extensive and led to a much deeper understanding of the game engine.

- **[Bug]** **Initial Bug:** Spoons would not decrease as intended.
- **[Investigation]** Hypothesized issues with `tmp.pointGen`, syntax errors, and incorrect `tree.js` structure. While some of these were issues, they were not the root cause.
- **[Discovery]** The first critical bug was identified: the `lastSpoonCheck` variable, used for consumption calculation, was not being reset after a prestige reset in the "Rest" layer. This caused the consumption logic to permanently halt after the first reset.
- **[Fix]** Implemented a `postReset()` function in the "Rest" layer to correctly reset `lastSpoonCheck` to 0. This fixed the "freezing" bug.
- **[Discovery]** The `lastSpoonCheck` method, while functional, introduced a new bug: a "rapid drain" effect due to timing issues in the game loop.
- **[Fix]** Replaced the `lastSpoonCheck` method with the engine's standard, time-based calculation (`tmp.pointGen.times(diff)`). With the underlying structural bugs now fixed, this method became stable and resolved the rapid drain issue.

### Burnout & Strategic Recovery Mechanics

- **[Mechanic]** Successfully implemented the initial "Burnout" state.
    - Triggers automatically when Spoons reach ≤ 0.
    - Provides clear visual feedback (Spoon counter turns red).
- **[Design]** Made the "Burnout" state persistent. Performing a "Rest" no longer automatically ends the state, creating a more significant challenge.
- **[Layer]** Designed and implemented the "Sleep" (S) layer as a strategic recovery tool.
    - It is an active ability, not a prestige reset.
    - Costs 10 RP to activate.
    - Instantly grants +5 Spoons, providing a direct way to combat Burnout.
    - Activates a 10-second "Sleep Bonus", boosting the effects of "Rest" layer upgrades.

### Balancing & UI Improvements

- **[Balance]** The "Mindful Breathing" upgrade was re-designed to provide a constant regeneration based on a percentage of *maximum* Spoons, making it useful during Burnout.
- **[Balance]** The regeneration rate was fine-tuned to 0.1% to ensure it was helpful but not overpowered.
- **[UI]** The description for "Mindful Breathing" was made dynamic to show the real-time effect of the "Sleep Bonus".
- **[UI]** Added visual feedback for the "Sleep Bonus": a timer at the top of the screen and a background color change for the "Rest" tab.
- **[Dev Tool]** Implemented debug buttons in the Info tab to control the game speed, significantly accelerating testing.
