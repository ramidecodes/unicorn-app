"use client";

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";

// Wrapper interface to maintain backward compatibility
interface AuthContextType {
  user: {
    id: string;
    email: string | null | undefined;
    created_at?: string;
  } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create a wrapper hook that provides the same interface as before
export const useAuth = (): AuthContextType => {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();

  const signOut = async () => {
    await clerkSignOut();
  };

  // Transform Clerk user to match expected interface
  const transformedUser = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        created_at: user.createdAt?.toISOString(),
      }
    : null;

  return {
    user: transformedUser,
    loading: !isLoaded,
    signOut,
  };
};
