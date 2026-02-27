"use server";

import { auth } from "@clerk/nextjs/server";
import { and, count, desc, eq } from "drizzle-orm";
import { cats, db } from "./db";
import type { CatFeatures } from "./catFeatures";

export interface Cat {
  id: string;
  user_id: string;
  created_at: string;
  features: CatFeatures;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}

function rowToCat(row: {
  id: string;
  userId: string;
  createdAt: Date;
  features: unknown;
  position: unknown;
  velocity: unknown;
}): Cat {
  return {
    id: row.id,
    user_id: row.userId,
    created_at: row.createdAt.toISOString(),
    features: row.features as CatFeatures,
    position: row.position as { x: number; y: number; z: number },
    velocity: row.velocity as { x: number; y: number; z: number },
  };
}

export interface CreateCatParams {
  userId: string;
  features: CatFeatures;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}

export async function createCat(params: CreateCatParams): Promise<Cat> {
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== params.userId) {
    throw new Error("Unauthorized: Cannot create cat for another user");
  }

  try {
    const [cat] = await db
      .insert(cats)
      .values({
        userId: params.userId,
        features: params.features,
        position: params.position,
        velocity: params.velocity,
      })
      .returning();

    return rowToCat(cat);
  } catch (error) {
    throw new Error(
      `Failed to create cat: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function getUserCats(userId: string): Promise<Cat[]> {
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== userId) {
    throw new Error("Unauthorized: Cannot fetch cats for another user");
  }

  try {
    const rows = await db
      .select()
      .from(cats)
      .where(eq(cats.userId, userId))
      .orderBy(desc(cats.createdAt));

    return rows.map(rowToCat);
  } catch (error) {
    throw new Error(
      `Failed to fetch cats: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function deleteCat(catId: string): Promise<void> {
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  try {
    const result = await db
      .delete(cats)
      .where(and(eq(cats.id, catId), eq(cats.userId, authenticatedUserId)))
      .returning();

    if (result.length === 0) {
      const [cat] = await db
        .select({ userId: cats.userId })
        .from(cats)
        .where(eq(cats.id, catId))
        .limit(1);

      if (!cat) {
        throw new Error("Cat not found");
      }

      throw new Error("Unauthorized: Cannot delete another user's cat");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      `Failed to delete cat: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function getUserCatCount(userId: string): Promise<number> {
  const { userId: authenticatedUserId } = await auth();

  if (!authenticatedUserId) {
    throw new Error("Unauthorized: User must be authenticated");
  }

  if (authenticatedUserId !== userId) {
    throw new Error("Unauthorized: Cannot count cats for another user");
  }

  try {
    const [{ count: catCount }] = await db
      .select({ count: count() })
      .from(cats)
      .where(eq(cats.userId, userId));

    return catCount;
  } catch (error) {
    throw new Error(
      `Failed to count cats: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
