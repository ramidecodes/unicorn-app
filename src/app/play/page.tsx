"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { UnicornScene } from "@/components/UnicornScene";
import { useAuth } from "@/contexts/AuthContext";
import { generateRandomFeatures } from "@/lib/unicornFeatures";
import {
  createUnicorn,
  getUserUnicorns,
  type Unicorn,
} from "@/lib/unicornService";
import { generateRandomFeatures as generateRandomLlamaFeatures } from "@/lib/llamaFeatures";
import { createLlama, getUserLlamas, type Llama } from "@/lib/llamaService";
import { generateRandomFeatures as generateRandomCatFeatures } from "@/lib/catFeatures";
import { createCat, getUserCats, type Cat } from "@/lib/catService";

function PlayPageContent() {
  const { user } = useAuth();
  const [unicorns, setUnicorns] = useState<Unicorn[]>([]);
  const [llamas, setLlamas] = useState<Llama[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingLlama, setCreatingLlama] = useState(false);
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    // Load unicorns and llamas when user is authenticated
    // Use user?.id as dependency to prevent re-runs when user object reference changes
    if (user?.id) {
      const loadCreatures = async () => {
        try {
          setLoading(true);
          const [userUnicorns, userLlamas, userCats] = await Promise.all([
            getUserUnicorns(user.id),
            getUserLlamas(user.id),
            getUserCats(user.id),
          ]);
          setUnicorns(userUnicorns);
          setLlamas(userLlamas);
          setCats(userCats);
        } catch (error) {
          console.error("Failed to load creatures:", error);
        } finally {
          setLoading(false);
        }
      };
      loadCreatures();
    } else {
      // If no user, set loading to false to prevent infinite loading
      setLoading(false);
    }
  }, [user?.id]);

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

  const handleCreateLlama = async () => {
    if (!user || creatingLlama) return;

    try {
      setCreatingLlama(true);
      const features = generateRandomLlamaFeatures();

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

      const newLlama = await createLlama({
        userId: user.id,
        features,
        position,
        velocity,
      });

      setLlamas((prev) => [newLlama, ...prev]);
    } catch (error) {
      console.error("Failed to create llama:", error);
      alert("Failed to create llama. Please try again.");
    } finally {
      setCreatingLlama(false);
    }
  };

  const handleCreateCat = async () => {
    if (!user || creatingCat) return;

    try {
      setCreatingCat(true);
      const features = generateRandomCatFeatures();

      const position = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8,
      };

      const velocity = {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 5,
      };

      const newCat = await createCat({
        userId: user.id,
        features,
        position,
        velocity,
      });

      setCats((prev) => [newCat, ...prev]);
    } catch (error) {
      console.error("Failed to create cat:", error);
      alert("Failed to create cat. Please try again.");
    } finally {
      setCreatingCat(false);
    }
  };

  // Show loading while fetching creatures
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-700">Loading creatures...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
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
          <Link
            href="/about"
            className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            About
          </Link>
        </div>
      </nav>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <UnicornScene unicorns={unicorns} llamas={llamas} cats={cats} />
      </div>

      {/* Create Buttons */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={handleCreateUnicorn}
          disabled={creating}
          className="rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "Creating Unicorn..." : "Create Unicorn"}
        </button>
        <button
          type="button"
          onClick={handleCreateLlama}
          disabled={creatingLlama}
          className="rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-brown-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creatingLlama ? "Creating Llama..." : "Create Llama"}
        </button>
        <button
          type="button"
          onClick={handleCreateCat}
          disabled={creatingCat}
          className="rounded-full bg-linear-to-r from-sky-500 via-indigo-500 to-violet-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creatingCat ? "Creating Cat..." : "Create Cat"}
        </button>
      </div>

      {/* Count Display */}
      <div className="absolute top-20 left-4 z-10 rounded bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow">
        Unicorns: {unicorns.length} | Llamas: {llamas.length} | Cats:{" "}
        {cats.length}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <>
      <SignedIn>
        <PlayPageContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
