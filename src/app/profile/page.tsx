"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useAuth } from "@/contexts/AuthContext";
import { getUserUnicornCount } from "@/lib/unicornService";

function ProfilePageContent() {
  const { user, signOut } = useAuth();
  const [unicornCount, setUnicornCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load stats when user is authenticated
    // Use user?.id as dependency to prevent re-runs when user object reference changes
    if (user?.id) {
      const loadStats = async () => {
        try {
          setLoading(true);
          const count = await getUserUnicornCount(user.id);
          setUnicornCount(count);
        } catch (error) {
          console.error("Failed to load stats:", error);
        } finally {
          setLoading(false);
        }
      };
      loadStats();
    } else {
      // If no user, set loading to false to prevent infinite loading
      setLoading(false);
    }
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Unknown";

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/play" className="text-xl font-bold text-gray-800">
              Unicorn App
            </Link>
            <div className="flex gap-4">
              <Link
                href="/play"
                className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          <div className="px-6 py-8">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">Profile</h1>

            <div className="space-y-6">
              {/* User Info */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Account Information
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Account Created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{createdAt}</dd>
                  </div>
                </dl>
              </div>

              {/* Stats */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Statistics
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 p-4">
                    <dt className="text-sm font-medium text-white/80">
                      Total Unicorns Created
                    </dt>
                    <dd className="mt-2 text-3xl font-bold text-white">
                      {unicornCount !== null ? unicornCount : "..."}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      <SignedIn>
        <ProfilePageContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
