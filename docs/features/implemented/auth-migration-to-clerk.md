# Feature Requirement Document: Authentication Migration to Clerk

## Feature Name

Authentication Migration from Supabase Auth to Clerk

## Goal

Migrate the application's authentication system from Supabase Auth to Clerk to leverage Clerk's advanced authentication features, better developer experience, and enhanced security capabilities. This migration will replace all Supabase Auth dependencies while maintaining existing functionality and user experience.

## User Story

As a developer, I want to migrate from Supabase Auth to Clerk, so that I can leverage Clerk's advanced authentication features, better user management, and improved security while maintaining all existing authentication functionality for end users.

## Functional Requirements

### 1. Authentication Provider Setup

- Install and configure Clerk for Next.js 16 (App Router)
- Set up Clerk environment variables (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
- Configure Clerk proxy (`proxy.ts`) for optimistic route protection (redirects)
- Replace Supabase AuthProvider with Clerk's ClerkProvider

### 2. User Authentication Flows

- **Login**: Migrate login page to use Clerk's sign-in components or API
- **Signup**: Migrate signup page to use Clerk's sign-up components or API
- **Sign Out**: Replace Supabase signOut with Clerk's signOut functionality
- **Session Management**: Replace Supabase session management with Clerk's session handling

### 3. Authentication Context Migration

- Replace `AuthContext` with Clerk's `useUser()` and `useAuth()` hooks
- Maintain backward compatibility with existing `useAuth()` hook interface where possible
- Update all components using `AuthContext` to use Clerk hooks
- Ensure loading states and user data are properly handled

### 4. Route Protection

- Update `proxy.ts` (formerly `middleware.ts`) to use Clerk's authentication for optimistic checks
- Use proxy for lightweight redirects (redirect unauthenticated users to `/login`)
- Implement actual authorization checks in server components and Data Access Layer (DAL)
- Protect routes: `/`, `/profile` (with proxy redirects and server-side authorization)
- Allow public access to: `/login`, `/signup`
- Follow Next.js 16 best practices: proxy for optimistic checks, server components for secure authorization

### 5. Database Integration

- Update `unicorns` table schema to support Clerk user IDs (string instead of UUID)
- Create migration script to:
  - Change `user_id` column type from UUID to VARCHAR/TEXT to store Clerk user IDs
  - Update index on `user_id` column to work with new type
- Update all database queries in `unicornService.ts` to use Clerk user IDs
- Note: Database migration to Neon will happen separately (see separate FRED)

### 6. Server-Side Authentication

- Replace Supabase server client with Clerk's server-side authentication
- Implement authorization checks in server components using Clerk's `auth()` helper
- Update Data Access Layer (DAL) to perform authorization checks close to data source
- Ensure proper session validation on server-side (not in proxy)
- Follow Next.js 16 best practices: keep authorization logic in server components/API routes

### 7. Client-Side Authentication

- Replace Supabase client authentication with Clerk's client-side hooks
- Update all components that access user data:
  - `src/app/page.tsx` (HomePage)
  - `src/app/profile/page.tsx` (ProfilePage)
  - Any other components using `useAuth()`

### 8. Environment Configuration

- Remove Supabase Auth environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL` (keep if still using Supabase for database)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (keep if still using Supabase for database)
- Add Clerk environment variables:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (optional, defaults to /sign-in)
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (optional, defaults to /sign-up)
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (optional)
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` (optional)

## Data Requirements

### Database Schema Changes

1. **unicorns table migration**:

   - Replace `user_id` column type from UUID to VARCHAR/TEXT to store Clerk user IDs
   - No existing users to migrate, so this is a clean change

2. **User ID Format**:

   - Supabase: UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`)
   - Clerk: String format (e.g., `user_2abc123def456`)
   - Since there are no existing users, no data migration needed

3. **Index Updates**:
   - Update `idx_unicorns_user_id` index to work with VARCHAR/TEXT type
   - Index will automatically work with the new column type

## User Flow

### Current Flow (Supabase)

1. User visits application
2. Middleware checks Supabase session
3. If no session, redirect to `/login`
4. User enters email/password on login page
5. Supabase authenticates user
6. Session stored in cookies
7. User redirected to home page
8. Application uses `useAuth()` to access user data

### New Flow (Clerk)

1. User visits application
2. Clerk middleware checks authentication
3. If not authenticated, redirect to `/login` (or Clerk's default sign-in page)
4. User enters email/password on login page (or uses Clerk components)
5. Clerk authenticates user
6. Session managed by Clerk
7. User redirected to home page
8. Application uses Clerk's `useUser()` hook to access user data

## Acceptance Criteria

1. **Installation & Configuration**

   - [ ] Clerk package installed (`@clerk/nextjs`)
   - [ ] Environment variables configured
   - [ ] ClerkProvider wraps application in root layout
   - [ ] Clerk proxy (`proxy.ts`) configured for optimistic redirects
   - [ ] Server-side authorization implemented in server components/DAL

2. **Authentication Pages**

   - [ ] Login page works with Clerk authentication
   - [ ] Signup page works with Clerk authentication
   - [ ] Users can successfully log in
   - [ ] Users can successfully sign up
   - [ ] Users can successfully sign out

3. **Route Protection**

   - [ ] Proxy (`proxy.ts`) redirects unauthenticated users to login (optimistic check)
   - [ ] Server components perform actual authorization checks
   - [ ] Authenticated users can access protected routes
   - [ ] Public routes (login/signup) are accessible without authentication
   - [ ] Authorization logic is in server components/DAL, not in proxy

4. **User Context**

   - [ ] All components using `useAuth()` work correctly
   - [ ] User data is accessible throughout the application
   - [ ] Loading states work correctly
   - [ ] User ID is available and in correct format

5. **Database Integration**

   - [ ] Database schema updated to support Clerk user IDs
   - [ ] All database queries use Clerk user IDs
   - [ ] Unicorn creation works with Clerk user IDs
   - [ ] Unicorn retrieval works with Clerk user IDs
   - [ ] User statistics display correctly

6. **Code Cleanup**

   - [ ] All Supabase Auth code removed or replaced
   - [ ] Supabase client usage removed from authentication flows (keep Supabase client for database queries until Neon migration)
   - [ ] Old AuthContext removed (if completely replaced)
   - [ ] All imports updated

7. **Testing**
   - [ ] New users can sign up and create unicorns
   - [ ] Existing functionality (unicorn creation, viewing, profile) works
   - [ ] Logout functionality works
   - [ ] Session persistence works across page refreshes

## Edge Cases

1. **User ID Format Mismatch**

   - Clerk uses string IDs, Supabase uses UUIDs
   - Database schema needs to accommodate this change
   - Foreign key constraints may need updating

2. **Session Management**

   - Clerk handles sessions differently than Supabase
   - Ensure session persistence works correctly
   - Handle session expiration gracefully

3. **Error Handling**

   - Authentication errors from Clerk need proper handling
   - Network errors during authentication
   - Invalid credentials handling

4. **Database Queries**

   - All queries using `user.id` need to work with Clerk's user ID format
   - Ensure type safety with TypeScript
   - Handle cases where user ID might be null/undefined

5. **Proxy Edge Cases**

   - API routes that need authentication (handle in API route, not proxy)
   - Static file serving
   - Webhook endpoints (if any)
   - Ensure proxy remains lightweight (no complex logic)

6. **Component Loading States**
   - Clerk's loading states may differ from Supabase
   - Ensure smooth transitions during authentication checks
   - Handle race conditions between auth state and data fetching

## Non-Functional Requirements

### Performance

- Proxy checks should be lightweight and fast (optimistic redirects only)
- Server-side authorization should be efficient
- Database queries should remain performant with new user ID format
- Keep proxy logic minimal to avoid performance impact

### Security

- All authentication should go through Clerk's secure endpoints
- Sensitive data should not be exposed in client-side code
- Proper session management and token handling

### Compatibility

- Maintain compatibility with Next.js 16 App Router
- Use `proxy.ts` instead of deprecated `middleware.ts`
- Follow Next.js 16 authentication best practices
- Ensure TypeScript types are correct throughout
- Follow existing code style and patterns

### Maintainability

- Code should be clean and well-documented
- Remove all unused Supabase Auth dependencies
- Update documentation to reflect Clerk usage

## Implementation Notes

### Files to Modify

1. `package.json` - Add Clerk, remove Supabase Auth (if not using for database)
2. `middleware.ts` → `proxy.ts` - Rename and replace with Clerk proxy for optimistic redirects
3. `src/app/layout.tsx` - Replace AuthProvider with ClerkProvider
4. `src/contexts/AuthContext.tsx` - Replace with Clerk hooks or create wrapper
5. `src/app/login/page.tsx` - Update to use Clerk
6. `src/app/signup/page.tsx` - Update to use Clerk
7. `src/app/page.tsx` - Update to use Clerk hooks, add server-side authorization
8. `src/app/profile/page.tsx` - Update to use Clerk hooks, add server-side authorization
9. `src/lib/unicornService.ts` - Update to use Clerk user IDs, add authorization checks in DAL
10. `src/lib/db/schema.ts` - Update user_id type if needed
11. `src/lib/supabase/client.ts` - May keep if still using Supabase for database
12. `src/lib/supabase/server.ts` - May keep if still using Supabase for database
13. `src/lib/supabase/middleware.ts` - Remove (replaced by proxy.ts)

### Files to Create

1. Migration script for database schema changes
2. Updated documentation in `docs/` directory

### Dependencies to Add

- `@clerk/nextjs` - Clerk SDK for Next.js

### Dependencies to Remove

- `@supabase/ssr` - Remove after migration (database migration to Neon will happen separately)
- `@supabase/supabase-js` - Keep temporarily for database queries until Neon migration

## Migration Strategy

### Phase 1: Setup

1. Install Clerk
2. Configure environment variables
3. Set up ClerkProvider
4. Rename `middleware.ts` to `proxy.ts` and configure Clerk proxy for optimistic redirects
5. Implement server-side authorization in server components

### Phase 2: Authentication Pages

1. Update login page
2. Update signup page
3. Test authentication flows

### Phase 3: Context & Hooks

1. Replace AuthContext with Clerk hooks
2. Update all components using authentication
3. Test user data access

### Phase 4: Database

1. Create database migration
2. Update schema
3. Update all database queries
4. Test database operations

### Phase 5: Cleanup

1. Remove Supabase Auth code
2. Update documentation
3. Remove unused dependencies
4. Final testing

## Notes

- **No Existing Users**: This migration does not need to handle existing user data, simplifying the process
- **Supabase Database**: Will continue using Supabase for database temporarily. Database migration to Neon will happen in a separate migration (see `database-migration-to-neon.md`)
- **Clerk Features**: Additional Clerk features (social auth, MFA, etc.) can be added in future iterations
- **Next.js 16 Best Practices**:
  - Use `proxy.ts` (not `middleware.ts`) for lightweight optimistic checks and redirects
  - Implement actual authorization in server components and Data Access Layer (DAL)
  - Keep proxy logic minimal - no complex session management or authorization logic
  - Authorization should be as close to data source as possible
