"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UnicornScene } from "@/components/UnicornScene";
import { useAuth } from "@/contexts/AuthContext";
import { generateRandomFeatures } from "@/lib/unicornFeatures";
import {
  createUnicorn,
  getUserUnicorns,
  type Unicorn,
} from "@/lib/unicornService";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [unicorns, setUnicorns] = useState<Unicorn[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const loadUnicorns = async () => {
        try {
          setLoading(true);
          const userUnicorns = await getUserUnicorns(user.id);
          setUnicorns(userUnicorns);
        } catch (error) {
          console.error("Failed to load unicorns:", error);
        } finally {
          setLoading(false);
        }
      };
      loadUnicorns();
    }
  }, [user, authLoading, router]);

  const handleCreateUnicorn = async () => {
    if (!user || creating) return;

    try {
      setCreating(true);
      const features = generateRandomFeatures();

      // Random spawn position
      const position = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8,
      };

      // Random velocity for bouncing
      const velocity = {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 5,
      };

      const newUnicorn = await createUnicorn({
        userId: user.id,
        features,
        position,
        velocity,
      });

      setUnicorns((prev) => [newUnicorn, ...prev]);
    } catch (error) {
      console.error("Failed to create unicorn:", error);
      alert("Failed to create unicorn. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-200">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-gray-800">Unicorn App</h1>
        <div className="flex gap-4">
          <Link
            href="/profile"
            className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            Profile
          </Link>
        </div>
      </nav>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <UnicornScene unicorns={unicorns} />
      </div>

      {/* Create Unicorn Button */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <button
          type="button"
          onClick={handleCreateUnicorn}
          disabled={creating}
          className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "Creating Unicorn..." : "Create Unicorn"}
        </button>
      </div>

      {/* Unicorn Count Display */}
      <div className="absolute top-20 left-4 z-10 rounded bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow">
        Unicorns: {unicorns.length}
      </div>
    </div>
  );
}
