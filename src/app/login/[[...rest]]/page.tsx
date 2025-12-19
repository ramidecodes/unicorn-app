import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Redirect authenticated users to play page
  // Middleware also handles this, but this provides additional protection
  const { userId } = await auth();
  if (userId) {
    redirect("/play");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignIn
        fallbackRedirectUrl="/play"
        signUpUrl="/signup"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-md",
          },
        }}
      />
    </div>
  );
}

