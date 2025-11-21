import { createClient } from "./supabase/client";
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

export async function createUnicorn(
  params: CreateUnicornParams
): Promise<Unicorn> {
  const supabase = createClient();

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

export async function getUserUnicorns(userId: string): Promise<Unicorn[]> {
  const supabase = createClient();

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

export async function deleteUnicorn(unicornId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("unicorns")
    .delete()
    .eq("id", unicornId);

  if (error) {
    throw new Error(`Failed to delete unicorn: ${error.message}`);
  }
}

export async function getUserUnicornCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("unicorns")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to count unicorns: ${error.message}`);
  }

  return data?.length || 0;
}
