"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "./supabase/server";
import type { UnicornFeatures } from "./unicornFeatures";

export interface Unicorn {
  id: string;
  user_id: string;
  created_at: string;
  features: UnicornFeatures;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
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

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("unicorns")
    .insert({
      user_id: params.userId,
      features: params.features,
      position: params.position,
      velocity: params.velocity,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create unicorn: ${error.message}`);
  }

  return data as Unicorn;
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

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("unicorns")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch unicorns: ${error.message}`);
  }

  return (data || []) as Unicorn[];
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

  const supabase = await createClient();

  // First, verify the unicorn belongs to the authenticated user
  const { data: unicorn, error: fetchError } = await supabase
    .from("unicorns")
    .select("user_id")
    .eq("id", unicornId)
    .single();

  if (fetchError || !unicorn) {
    throw new Error(`Unicorn not found: ${fetchError?.message || "Unknown error"}`);
  }

  if (unicorn.user_id !== authenticatedUserId) {
    throw new Error("Unauthorized: Cannot delete another user's unicorn");
  }

  const { error } = await supabase
    .from("unicorns")
    .delete()
    .eq("id", unicornId);

  if (error) {
    throw new Error(`Failed to delete unicorn: ${error.message}`);
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

  const supabase = await createClient();

  const { count, error } = await supabase
    .from("unicorns")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to count unicorns: ${error.message}`);
  }

  return count || 0;
}
