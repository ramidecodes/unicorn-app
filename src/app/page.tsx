import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-6 text-6xl font-bold text-gray-900">
          🦄 Unicorn App
        </h1>
        <p className="mb-8 text-xl text-gray-700">
          Create and watch your magical unicorns bounce around in 3D!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-800 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
