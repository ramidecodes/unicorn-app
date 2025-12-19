# Feature Requirement Document: Database Migration to Neon

## Feature Name
Database Migration from Supabase to Neon

## Goal
Migrate the application's database from Supabase to Neon (serverless Postgres) to leverage Neon's serverless architecture, better scalability, and cost-effective pricing. This migration will replace all Supabase database dependencies while maintaining existing data and functionality.

## User Story
As a developer, I want to migrate from Supabase database to Neon, so that I can leverage Neon's serverless Postgres capabilities, better performance, and cost efficiency while maintaining all existing database functionality and data integrity.

## Functional Requirements

### 1. Database Provider Setup
- Create Neon database instance
- Configure Neon connection string
- Update environment variables to use Neon connection
- Verify database connectivity

### 2. Database Connection Migration
- Replace Supabase database connection with Neon connection string
- Choose appropriate Neon connection type:
  - **Pooled connection** (recommended for Next.js serverless): Use Neon's connection pooler for better scalability
  - **Direct connection**: Use for persistent servers or when connection pooling is handled at application level
- Configure `postgres-js` connection pool settings for serverless:
  - Set `max: 1` for serverless functions (Next.js API routes, Server Actions)
  - Use connection pooling for persistent servers
- Update `DATABASE_URL` environment variable with Neon connection string
- Ensure SSL/TLS is enabled (`sslmode=require` in connection string)
- Ensure Drizzle ORM continues to work with Neon (compatible as both are Postgres)
- Test database connection from application
- Implement connection error handling and retry logic

### 3. Database Query Migration
- Replace Supabase client queries in `unicornService.ts` with Drizzle ORM queries
- Update all database operations:
  - `createUnicorn()` - Use Drizzle insert with authorization check
  - `getUserUnicorns()` - Use Drizzle select with where clause and authorization check
  - `deleteUnicorn()` - Use Drizzle delete with authorization check
  - `getUserUnicornCount()` - Use Drizzle select with count and authorization check
- Implement authorization checks in Data Access Layer (DAL) - verify user owns resources
- Maintain existing functionality and data structure
- Ensure type safety with TypeScript
- Follow Next.js 16 best practices: authorization close to data source

### 4. Migration Scripts
- Migrate existing database schema to Neon
- Run existing migrations on Neon database
- Verify all tables, indexes, and constraints are created correctly
- Optionally rename migration folder from `supabase/migrations` to `migrations` or `neon/migrations`

### 5. Data Migration (if applicable)
- Export data from Supabase database
- Import data to Neon database
- Verify data integrity after migration
- Handle any data type mismatches or constraints

### 6. Environment Configuration
- Remove Supabase-specific environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL` (if not used elsewhere)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if not used elsewhere)
- Update `DATABASE_URL` to point to Neon connection string
- Update any documentation referencing Supabase database setup

### 7. Code Cleanup
- Remove Supabase client imports from database-related files
- Remove `@supabase/ssr` and `@supabase/supabase-js` dependencies (if not used for other purposes)
- Update all references to Supabase in code comments and documentation
- Clean up unused Supabase utility files if no longer needed

## Data Requirements

### Database Schema
- No schema changes required - Neon uses standard Postgres, compatible with existing Drizzle schema
- Existing `unicorns` table structure remains the same
- All indexes and constraints remain valid

### Data Migration Strategy
1. **Pre-Migration Backup**:
   - Export all data from Supabase database
   - Verify backup integrity

2. **Schema Migration**:
   - Run existing Drizzle migrations on Neon database
   - Verify schema matches exactly

3. **Data Migration**:
   - Import data to Neon database
   - Verify record counts match
   - Test sample queries to ensure data integrity

4. **Validation**:
   - Compare data between Supabase and Neon
   - Test all CRUD operations
   - Verify foreign key relationships (if any)

### Connection String Format

#### Supabase Connection String
- **Direct**: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **Pooled (Session)**: `postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
- **Pooled (Transaction)**: `postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

#### Neon Connection String
- **Direct**: `postgresql://[USER]:[PASSWORD]@[ENDPOINT]/[DATABASE]?sslmode=require`
- **Pooled (Recommended for Next.js)**: `postgresql://[USER]:[PASSWORD]@[ENDPOINT]/[DATABASE]?sslmode=require&pgbouncer=true`
  - Neon provides pooled connection strings automatically in the dashboard
  - Pooled connections are recommended for serverless environments (Next.js API routes, Server Actions)
  - Direct connections are suitable for persistent servers or when using application-level pooling

#### Connection String Best Practices
- Always include `sslmode=require` for secure connections
- For serverless (Next.js), prefer pooled connections to handle connection limits efficiently
- For persistent servers, direct connections may be more efficient
- Both use standard Postgres connection strings, so Drizzle ORM works with both
- Connection strings should be stored as environment variables, never committed to version control

## User Flow

### Current Flow (Supabase)
1. Application connects to Supabase database via `DATABASE_URL`
2. Drizzle ORM uses postgres-js to connect
3. `unicornService.ts` uses Supabase client for queries
4. Data stored in Supabase Postgres instance

### New Flow (Neon)
1. Application connects to Neon database via `DATABASE_URL` (pooled connection for serverless)
2. Drizzle ORM uses postgres-js with optimized connection pool settings:
   - Serverless functions: `max: 1` connection per instance
   - Persistent servers: Appropriate pool size based on server capacity
3. `unicornService.ts` uses Drizzle ORM for queries (replacing Supabase client)
4. Data stored in Neon serverless Postgres instance
5. Connection pooling handled by Neon's pooler (for pooled connections) or application-level (for direct connections)

## Acceptance Criteria

1. **Database Setup**
   - [ ] Neon database instance created
   - [ ] Connection string configured
   - [ ] Database connection successful
   - [ ] Environment variables updated

2. **Schema Migration**
   - [ ] All migrations run successfully on Neon
   - [ ] `unicorns` table created with correct schema
   - [ ] All indexes created correctly
   - [ ] Schema matches Supabase exactly

3. **Code Migration**
   - [ ] `unicornService.ts` updated to use Drizzle instead of Supabase client
   - [ ] Authorization checks implemented in Data Access Layer (DAL)
   - [ ] All CRUD operations work correctly:
     - [ ] Create unicorn (with authorization)
     - [ ] Get user unicorns (with authorization - only own unicorns)
     - [ ] Delete unicorn (with authorization - only own unicorns)
     - [ ] Get user unicorn count (with authorization)
   - [ ] Type safety maintained with TypeScript

4. **Data Migration** (if applicable)
   - [ ] All data exported from Supabase
   - [ ] All data imported to Neon
   - [ ] Data integrity verified
   - [ ] Record counts match

5. **Functionality Testing**
   - [ ] Users can create unicorns
   - [ ] Users can view their unicorns
   - [ ] Users can delete unicorns
   - [ ] Profile statistics display correctly
   - [ ] All existing features work as before

6. **Code Cleanup**
   - [ ] Supabase client removed from database queries
   - [ ] Unused Supabase dependencies removed
   - [ ] Documentation updated
   - [ ] Code comments updated

7. **Connection Configuration**
   - [ ] Connection pool settings configured correctly for serverless environment
   - [ ] `postgres-js` configured with `max: 1` for Next.js serverless functions
   - [ ] SSL/TLS enabled in connection string
   - [ ] Connection error handling and retry logic implemented
   - [ ] No connection timeouts or "max connections" errors

8. **Performance**
   - [ ] Database queries perform at least as well as before
   - [ ] Connection pooling works correctly (Neon pooler or application-level)
   - [ ] Cold start impact minimized (Neon serverless consideration)
   - [ ] Query response times acceptable

## Edge Cases

1. **Connection String Format and Pooling**
   - Neon connection strings require SSL mode (`sslmode=require`)
   - Choose between pooled and direct connections based on deployment type:
     - **Serverless (Next.js)**: Use pooled connections to handle connection limits
     - **Persistent servers**: Can use direct connections with application-level pooling
   - Connection pooling parameters differ between Neon and Supabase
   - Handle connection string parsing correctly
   - For serverless, configure `postgres-js` with `max: 1` to avoid connection exhaustion
   - Monitor connection usage to prevent "max client connections" errors

2. **Data Type Compatibility**
   - Ensure UUID types work correctly
   - Verify JSONB types are handled properly
   - Check timestamp with timezone handling

3. **Migration Timing**
   - When to switch from Supabase to Neon?
   - How to handle zero-downtime migration?
   - Rollback strategy if migration fails

4. **Query Performance and Serverless Considerations**
   - Neon's serverless architecture may have cold starts (compute suspension after inactivity)
   - First query after cold start may have higher latency (~100-500ms)
   - Subsequent queries are fast (hot connections)
   - Connection pooling behavior differs from Supabase:
     - Neon's pooler handles connection management automatically
     - Application should use minimal connections for serverless (`max: 1`)
   - Index usage and query optimization remain important
   - Consider implementing query result caching for frequently accessed data
   - Monitor query performance and optimize slow queries

5. **Error Handling and Retry Logic**
   - Database connection errors:
     - Handle connection failures gracefully
     - Implement exponential backoff retry logic
     - Log connection errors for monitoring
   - Query timeout handling:
     - Set appropriate query timeouts
     - Handle timeout errors with user-friendly messages
   - Transaction rollback behavior:
     - Ensure transactions roll back correctly on errors
     - Handle deadlock and lock timeout scenarios
   - Cold start handling:
     - First query after cold start may timeout - implement retry logic
     - Consider connection warming strategies for critical paths

6. **Environment Variables**
   - Different connection strings for development/production
   - Handling of connection string in different environments
   - Secret management

7. **Drizzle ORM Compatibility and Configuration**
   - Ensure Drizzle works seamlessly with Neon (both use standard Postgres)
   - Migration scripts compatibility (Drizzle Kit works with Neon)
   - Type generation compatibility (Drizzle generates types from schema)
   - Connection configuration:
     - Use `postgres-js` with appropriate pool settings
     - For serverless: `postgres(connectionString, { max: 1 })`
     - For persistent servers: `postgres(connectionString, { max: 10 })` or appropriate size
   - Avoid prepared statements if using pooled connections (not supported in transaction mode)
   - Ensure Drizzle queries are optimized (select only needed fields, use indexes)

## Non-Functional Requirements

### Performance
- Database queries should maintain or improve performance
- Connection pooling should be efficient:
  - Use Neon's pooled connections for serverless environments
  - Configure `postgres-js` with appropriate `max` connections (1 for serverless, higher for persistent)
  - Monitor connection usage to prevent exhaustion
- Cold starts should be minimized (Neon serverless consideration):
  - First query after inactivity may have ~100-500ms latency
  - Implement retry logic for first query after cold start
  - Consider connection warming for critical user paths
  - Monitor and optimize query performance

### Reliability
- Database connection should be stable
- Automatic reconnection on connection loss
- Proper error handling and logging

### Security
- Connection strings should be stored securely
- SSL/TLS encryption for database connections
- No sensitive data in logs or error messages

### Compatibility
- Maintain compatibility with Drizzle ORM
- Ensure TypeScript types remain correct
- Follow existing code patterns and style

### Maintainability
- Code should be clean and well-documented
- Remove all unused Supabase dependencies
- Update all documentation to reflect Neon usage

### Observability
- Monitor database connection usage to prevent exhaustion
- Track query performance and identify slow queries
- Monitor Neon compute suspension and cold start frequency
- Set up alerts for connection errors and timeouts
- Use Neon's dashboard for database metrics and insights

## Implementation Notes

### Files to Modify
1. `src/lib/unicornService.ts` - Replace Supabase client with Drizzle queries
2. `src/lib/db/index.ts` - Update connection configuration:
   - Configure `postgres-js` with appropriate pool settings for serverless
   - Set `max: 1` for Next.js serverless functions
   - Add connection error handling and retry logic
   - Ensure SSL is enabled
3. `drizzle.config.ts` - Update if migration folder renamed
4. `src/lib/db/migrate.ts` - Verify works with Neon (should work as-is, already uses `max: 1`)
5. `.env.local` / `.env` - Update `DATABASE_URL` with Neon connection string (pooled recommended)
6. `package.json` - Remove Supabase dependencies (if not used elsewhere)
7. `README.md` - Update setup instructions with Neon-specific configuration

### Files to Remove (if no longer needed)
1. `src/lib/supabase/client.ts` - Remove if only used for database
2. `src/lib/supabase/server.ts` - Remove if only used for database
3. `src/lib/supabase/middleware.ts` - Already removed in Clerk migration

### Files to Create
1. Data migration script (if existing data needs to be migrated)
2. Updated documentation

### Dependencies to Remove
- `@supabase/ssr` - Remove if not used elsewhere
- `@supabase/supabase-js` - Remove if not used elsewhere

### Dependencies to Keep
- `drizzle-orm` - Continue using for database queries
- `drizzle-kit` - Continue using for migrations
- `postgres` - Continue using for database connection

## Migration Strategy

### Phase 1: Preparation
1. Create Neon database instance
2. Choose connection type:
   - **Pooled connection** (recommended for Next.js serverless)
   - **Direct connection** (for persistent servers or testing)
3. Get Neon connection string from dashboard (pooled or direct)
4. Test connection from local environment using `psql` or Drizzle Studio
5. Backup Supabase database (if data exists)
6. Consider creating a Neon branch for testing migrations (Neon branching feature)

### Phase 2: Schema Migration
1. Update `DATABASE_URL` to Neon (temporarily or in separate environment)
   - Consider using Neon database branching for isolated testing
2. Update `src/lib/db/index.ts` with proper connection pool configuration
3. Run Drizzle migrations on Neon database using `pnpm db:migrate`
4. Verify schema matches Supabase:
   - Check all tables exist
   - Verify indexes are created
   - Confirm constraints are applied
5. Test basic queries using Drizzle Studio (`pnpm db:studio`)
6. Verify connection pooling works correctly

### Phase 3: Code Migration
1. Update `unicornService.ts` to use Drizzle
2. Replace all Supabase client calls with Drizzle queries
3. Test all CRUD operations
4. Verify type safety

### Phase 4: Data Migration (if applicable)
1. Export data from Supabase:
   - Use `pg_dump` for full database export
   - Or export specific tables using SQL queries
   - Verify export completeness
2. Import data to Neon:
   - Use `psql` or Neon's import tools
   - Consider using Neon's logical replication for zero-downtime migration (if needed)
   - For large datasets: import data first, then create indexes (faster migration)
3. Verify data integrity:
   - Compare record counts between Supabase and Neon
   - Test sample queries on migrated data
   - Verify foreign key relationships (if any)
   - Check data types match correctly
4. Test with real data:
   - Run all CRUD operations
   - Verify authorization checks work correctly
   - Test edge cases and error scenarios

### Phase 5: Switchover
1. Update production `DATABASE_URL` to Neon
2. Monitor for errors
3. Verify all functionality works
4. Keep Supabase as backup temporarily

### Phase 6: Monitoring and Optimization
1. Set up monitoring for:
   - Connection usage and pool status
   - Query performance metrics
   - Cold start frequency and impact
   - Error rates and types
2. Optimize based on monitoring data:
   - Adjust connection pool settings if needed
   - Optimize slow queries
   - Add indexes where beneficial
3. Document Neon-specific operational procedures

### Phase 7: Cleanup
1. Remove Supabase dependencies
2. Update documentation
3. Remove unused Supabase files
4. Final testing
5. Archive Supabase database (after backup period)

## Drizzle Query Examples

### Current (Supabase Client)
```typescript
const { data, error } = await supabase
  .from("unicorns")
  .insert({ user_id, features, position, velocity })
  .select()
  .single();
```

### New (Drizzle ORM)
```typescript
// Insert with returning
const [unicorn] = await db
  .insert(unicorns)
  .values({ userId, features, position, velocity })
  .returning();

// Select with where clause
const userUnicorns = await db
  .select()
  .from(unicorns)
  .where(eq(unicorns.userId, userId))
  .orderBy(desc(unicorns.createdAt));

// Delete with authorization check
await db
  .delete(unicorns)
  .where(and(
    eq(unicorns.id, unicornId),
    eq(unicorns.userId, userId) // Authorization check
  ));

// Count with where clause
const [{ count }] = await db
  .select({ count: count() })
  .from(unicorns)
  .where(eq(unicorns.userId, userId));
```

## Connection Configuration Examples

### Serverless Configuration (Next.js API Routes, Server Actions)
```typescript
// src/lib/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// For serverless: use max: 1 connection per instance
// Neon's pooler handles connection management
const client = postgres(process.env.DATABASE_URL, {
  max: 1, // Single connection for serverless
  ssl: "require", // Ensure SSL is enabled
});

export const db = drizzle(client, { schema });
export { schema };
```

### Persistent Server Configuration
```typescript
// For persistent servers (VMs, long-running containers)
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // Appropriate pool size for persistent server
  ssl: "require",
});

export const db = drizzle(client, { schema });
```

## Best Practices

### Connection Pooling for Serverless
- **Next.js Serverless Functions**: Use `max: 1` connection per function instance
- **Neon Pooled Connections**: Recommended for serverless to handle connection limits efficiently
- **Connection Limits**: Monitor connection usage to prevent "max client connections" errors
- **Connection Lifecycle**: Connections are automatically managed by Neon's pooler for pooled connections

### Migration Best Practices
- **Use Drizzle Kit**: Always use `drizzle-kit` for generating and applying migrations
- **Don't Modify History**: Never manually edit migration history files
- **Test Migrations**: Use Neon database branching to test migrations in isolation
- **Version Control**: Keep all migration files in version control
- **Sequential Migrations**: Maintain chronological order of migrations

### Query Optimization
- **Select Only Needed Fields**: Use Drizzle's select to fetch only required columns
- **Use Indexes**: Ensure indexes are created for frequently queried columns
- **Avoid N+1 Queries**: Use Drizzle's relational queries or batch operations
- **Monitor Performance**: Track query performance and optimize slow queries

### Error Handling
- **Connection Errors**: Implement retry logic with exponential backoff
- **Query Timeouts**: Set appropriate timeouts and handle gracefully
- **Cold Starts**: First query after Neon cold start may be slower - implement retry logic
- **Logging**: Log errors for monitoring but avoid exposing sensitive data

### Security
- **SSL/TLS**: Always use SSL connections (`sslmode=require`)
- **Connection Strings**: Store in environment variables, never commit to version control
- **Authorization**: Implement authorization checks at the Data Access Layer (DAL)
- **SQL Injection**: Drizzle ORM prevents SQL injection through parameterized queries

## Notes

- **Postgres Compatibility**: Both Supabase and Neon use standard Postgres, so Drizzle ORM works with both without changes
- **Connection**: The main change is the connection string and query method (Supabase client → Drizzle ORM)
- **Connection Pooling**: For serverless (Next.js), use Neon's pooled connections with `max: 1` in postgres-js
- **No Schema Changes**: Database schema remains the same, only the provider changes
- **Migration Folder**: Consider renaming `supabase/migrations` to `migrations` or `db/migrations` for clarity
- **Neon Branching**: Use Neon's database branching feature for testing migrations without affecting production
- **Cold Starts**: Neon's serverless architecture may suspend compute after inactivity, causing ~100-500ms latency on first query

## Questions to Resolve

1. **Data Migration**: Is there existing production data that needs to be migrated?
2. **Migration Folder**: Should we rename `supabase/migrations` to a more generic name (e.g., `migrations` or `db/migrations`)?
3. **Zero Downtime**: Do we need zero-downtime migration strategy? (Consider Neon's logical replication if needed)
4. **Backup Strategy**: How long should we keep Supabase as backup after migration?
5. **Connection Type**: Should we use Neon's pooled connection (recommended for Next.js) or direct connection?
6. **Database Branching**: Should we use Neon's database branching feature for testing migrations?
7. **Monitoring**: What monitoring tools should we set up for Neon database performance and connection usage?

