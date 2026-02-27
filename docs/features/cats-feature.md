# Cats Feature Requirement Document (FRED)

## Feature Name
Cats as Playable Creature Type

## Goal
Add Cats as a first-class creature in the app so users can create, persist, and view cats with the same behavior and interaction pattern used for Unicorns and Llamas.

## User Story
As an authenticated user, I want to create Cats in the play scene, so that I can collect and interact with another creature type with parity to existing animals.

## Functional Requirements
1. The system must store Cats in a dedicated `cats` table with the same core fields used by other creature tables (`id`, `user_id`, `created_at`, `features`, `position`, `velocity`).
2. The system must provide server-side Cat operations with authorization checks:
   - `createCat`
   - `getUserCats`
   - `deleteCat`
   - `getUserCatCount`
3. The Play page must load Cats together with Unicorns and Llamas for the authenticated user.
4. The Play page must provide a `Create Cat` button with disabled/loading state while creation is in progress.
5. Creating a Cat must persist it to the database and render it in the 3D scene without requiring a page refresh.
6. The scene count display must include Cats.
7. Cat feature generation must be deterministic in type shape and randomized in values, similar to existing creature feature generators.

## Data Requirements
- Add new table: `cats`
  - `id` UUID primary key with random default
  - `user_id` varchar(255), required
  - `created_at` timestamp with timezone, default `now()`, required
  - `features` jsonb, default `{}`, required
  - `position` jsonb, default `{ x: 0, y: 0, z: 0 }`, required
  - `velocity` jsonb, default `{ x: 0, y: 0, z: 0 }`, required
- Add indexes:
  - `idx_cats_user_id`
  - `idx_cats_created_at`
- Export `cats` from DB module for service usage.

## User Flow
1. User visits `/play` while authenticated.
2. App loads Unicorns, Llamas, and Cats for the user.
3. User clicks `Create Cat`.
4. App generates random cat features, position, and velocity.
5. App calls server action to create Cat with authorization validation.
6. New Cat is returned and prepended to client state.
7. Scene updates to show the Cat and count display increments.

## Acceptance Criteria
- [ ] `cats` table and indexes exist in schema and migration SQL.
- [ ] Cat server actions enforce auth constraints equivalent to Unicorn/Llama services.
- [ ] Play page loads and renders cats with existing creatures.
- [ ] `Create Cat` button creates and displays a Cat with loading and error handling.
- [ ] Creature count display includes Cats.
- [ ] Lint/type checks pass for changed files.

## Edge Cases
1. Unauthorized creation attempt
   - Expected: request fails with `Unauthorized` error.
2. Cross-user read/count attempt
   - Expected: request fails with `Unauthorized` error.
3. Creation failure (DB/network)
   - Expected: user receives failure alert; loading state resets.
4. Empty cats dataset
   - Expected: scene renders without cats and no runtime errors.

## Non-Functional Requirements
- Preserve current page responsiveness and rendering behavior.
- Reuse existing service/component patterns to minimize maintenance risk.
- Keep changes type-safe with explicit Cat interfaces and feature types.
