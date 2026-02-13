"use server";

import { auth } from "@clerk/nextjs/server";
import { and, count, desc, eq } from "drizzle-orm";
import { db, llamas } from "./db";
import type { LlamaFeatures } from "./llamaFeatures";

export interface Llama {
  id: string;
  user_id: string;
  created_at: string;
  features: LlamaFeatures;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}
// Another comments
// Helper function to convert Drizzle row to Llama interface
// Drizzle returns camelCase properties (userId, createdAt) matching the schema
// JSONB fields are typed as unknown, so we need to assert their types
function rowToLlama(row: {
  id: string;
  userId: string;
  createdAt: Date;
  features: unknown;
  position: unknown;
  velocity: unknown;
}): Llama {
  return {
    id: row.id,
    user_id: row.userId, // Map from camelCase to snake_case for interface
    created_at: row.createdAt.toISOString(),
    features: row.features as LlamaFeatures,
    position: row.position as { x: number; y: number; z: number },
    velocity: row.velocity as { x: number; y: number; z: number },
  };
}

export interface CreateLlamaParams {
  userId: string;
  features: LlamaFeatures;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}

/**
 * Server-side function to create a llama with authorization check
 * Authorization: Ensures the authenticated user matches the userId parameter
 */
export async function createLlama(params: CreateLlamaParams): Promise<Llama> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== params.userId) {
    throw new Error("Unauthorized: Cannot create llama for another user");
  }

  try {
    const [llama] = await db
      .insert(llamas)
      .values({
        userId: params.userId,
        features: params.features,
        position: params.position,
        velocity: params.velocity,
      })
      .returning();

    return rowToLlama(llama);
  } catch (error) {
    throw new Error(
      `Failed to create llama: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Server-side function to get user's llamas with authorization check
 * Authorization: Ensures the authenticated user matches the userId parameter
 */
export async function getUserLlamas(userId: string): Promise<Llama[]> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== userId) {
    throw new Error("Unauthorized: Cannot fetch llamas for another user");
  }

  try {
    const rows = await db
      .select()
      .from(llamas)
      .where(eq(llamas.userId, userId))
      .orderBy(desc(llamas.createdAt));

    return rows.map(rowToLlama);
  } catch (error) {
    throw new Error(
      `Failed to fetch llamas: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Server-side function to delete a llama with authorization check
 * Authorization: Ensures the authenticated user owns the llama
 */
export async function deleteLlama(llamaId: string): Promise<void> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  try {
    // Delete with authorization check - only delete if llama belongs to authenticated user
    const result = await db
      .delete(llamas)
      .where(
        and(eq(llamas.id, llamaId), eq(llamas.userId, authenticatedUserId)),
      )
      .returning();

    if (result.length === 0) {
      // Either llama doesn't exist or doesn't belong to user
      // Check if llama exists at all
      const [llama] = await db
        .select({ userId: llamas.userId })
        .from(llamas)
        .where(eq(llamas.id, llamaId))
        .limit(1);

      if (!llama) {
        throw new Error("Llama not found");
      }
      throw new Error("Unauthorized: Cannot delete another user's llama");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Failed to delete llama: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Server-side function to get user's llama count with authorization check
 * Authorization: Ensures the authenticated user matches the userId parameter
 */
export async function getUserLlamaCount(userId: string): Promise<number> {
  // Server-side authorization check
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== userId) {
    throw new Error("Unauthorized: Cannot count llamas for another user");
  }

  try {
    const [{ count: llamaCount }] = await db
      .select({ count: count() })
      .from(llamas)
      .where(eq(llamas.userId, userId));

    return llamaCount;
  } catch (error) {
    throw new Error(
      `Failed to count llamas: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
