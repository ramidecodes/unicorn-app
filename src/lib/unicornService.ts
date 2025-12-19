"use server";

import { auth } from "@clerk/nextjs/server";
import { and, count, desc, eq } from "drizzle-orm";
import { db, unicorns } from "./db";
import type { UnicornFeatures } from "./unicornFeatures";

export interface Unicorn {
  id: string;
  user_id: string;
  created_at: string;
  features: UnicornFeatures;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}

// Helper function to convert Drizzle row to Unicorn interface
// Drizzle returns camelCase properties (userId, createdAt) matching the schema
// JSONB fields are typed as unknown, so we need to assert their types
function rowToUnicorn(row: {
  id: string;
  userId: string;
  createdAt: Date;
  features: unknown;
  position: unknown;
  velocity: unknown;
}): Unicorn {
  return {
    id: row.id,
    user_id: row.userId, // Map from camelCase to snake_case for interface
    created_at: row.createdAt.toISOString(),
    features: row.features as UnicornFeatures,
    position: row.position as { x: number; y: number; z: number },
    velocity: row.velocity as { x: number; y: number; z: number },
  };
}

export interface CreateUnicornParams {
  userId: string;
  features: UnicornFeatures;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}

/**
 * Server-side function to create a unicorn with authorization check
 * Authorization: Ensures the authenticated user matches the userId parameter
 */
export async function createUnicorn(
  params: CreateUnicornParams,
): Promise<Unicorn> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== params.userId) {
    throw new Error("Unauthorized: Cannot create unicorn for another user");
  }

  try {
    const [unicorn] = await db
      .insert(unicorns)
      .values({
        userId: params.userId,
        features: params.features,
        position: params.position,
        velocity: params.velocity,
      })
      .returning();

    return rowToUnicorn(unicorn);
  } catch (error) {
    throw new Error(
      `Failed to create unicorn: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Server-side function to get user's unicorns with authorization check
 * Authorization: Ensures the authenticated user matches the userId parameter
 */
export async function getUserUnicorns(userId: string): Promise<Unicorn[]> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== userId) {
    throw new Error("Unauthorized: Cannot fetch unicorns for another user");
  }

  try {
    const rows = await db
      .select()
      .from(unicorns)
      .where(eq(unicorns.userId, userId))
      .orderBy(desc(unicorns.createdAt));

    return rows.map(rowToUnicorn);
  } catch (error) {
    throw new Error(
      `Failed to fetch unicorns: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Server-side function to delete a unicorn with authorization check
 * Authorization: Ensures the authenticated user owns the unicorn
 */
export async function deleteUnicorn(unicornId: string): Promise<void> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  try {
    // Delete with authorization check - only delete if unicorn belongs to authenticated user
    const result = await db
      .delete(unicorns)
      .where(and(eq(unicorns.id, unicornId), eq(unicorns.userId, authenticatedUserId)))
      .returning();

    if (result.length === 0) {
      // Either unicorn doesn't exist or doesn't belong to user
      // Check if unicorn exists at all
      const [unicorn] = await db
        .select({ userId: unicorns.userId })
        .from(unicorns)
        .where(eq(unicorns.id, unicornId))
        .limit(1);

      if (!unicorn) {
        throw new Error("Unicorn not found");
      }
      throw new Error("Unauthorized: Cannot delete another user's unicorn");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Failed to delete unicorn: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Server-side function to get user's unicorn count with authorization check
 * Authorization: Ensures the authenticated user matches the userId parameter
 */
export async function getUserUnicornCount(userId: string): Promise<number> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== userId) {
    throw new Error("Unauthorized: Cannot count unicorns for another user");
  }

  try {
    const [{ count: unicornCount }] = await db
      .select({ count: count() })
      .from(unicorns)
      .where(eq(unicorns.userId, userId));

    return unicornCount;
  } catch (error) {
    throw new Error(
      `Failed to count unicorns: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
