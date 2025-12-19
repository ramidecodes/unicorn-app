import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Unicorn App",
  description:
    "Learn about Unicorn App - Create and watch your magical unicorns bounce around in 3D! Built with Next.js, React Three Fiber, and modern web technologies.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white/80 shadow backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-800">
              🦄 Unicorn App
            </Link>
            <div className="flex gap-4">
              <Link
                href="/"
                className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="rounded bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-medium text-white hover:from-pink-600 hover:to-purple-600"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            🦄 About Unicorn App
          </h1>
          <p className="text-xl text-gray-700">
            Create and watch your magical unicorns bounce around in 3D!
          </p>
        </div>

        <div className="space-y-8">
          {/* App Description */}
          <div className="rounded-lg bg-white/90 p-8 shadow-lg backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              What is Unicorn App?
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Unicorn App is an interactive 3D web application where users can
              create and watch animated unicorns bounce around in a physics-based
              environment. Each unicorn is uniquely generated with randomized
              features including colors, accessories, and hair styles. The app
              combines modern web technologies with 3D graphics to create a
              magical and engaging user experience.
            </p>
          </div>

          {/* Features Section */}
          <div className="rounded-lg bg-white/90 p-8 shadow-lg backdrop-blur-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Features</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    User Authentication
                  </h3>
                  <p className="text-gray-600">
                    Secure authentication with Clerk for seamless user
                    experience
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🦄</span>
                <div>
                  <h3 className="font-semibold text-gray-900">3D Unicorns</h3>
                  <p className="text-gray-600">
                    Create 3D unicorns with randomized features including colors,
                    accessories, and hair styles
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🌈</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Rainbow Particles
                  </h3>
                  <p className="text-gray-600">
                    Beautiful rainbow particle effects overlay for enhanced
                    visual appeal
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Physics-Based Animation
                  </h3>
                  <p className="text-gray-600">
                    Realistic physics simulation using Rapier for bouncing and
                    movement
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💾</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Persistent Storage
                  </h3>
                  <p className="text-gray-600">
                    Your unicorns are saved to the database and persist across
                    sessions
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-gray-900">User Profile</h3>
                  <p className="text-gray-600">
                    Track your unicorn creation statistics and account
                    information
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Tech Stack Section */}
          <div className="rounded-lg bg-white/90 p-8 shadow-lg backdrop-blur-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Tech Stack
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 p-4">
                <h3 className="mb-2 font-semibold text-white">Frontend</h3>
                <ul className="space-y-1 text-sm text-white/90">
                  <li>• Next.js 15+ (App Router)</li>
                  <li>• React 19</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• React Three Fiber</li>
                  <li>• React Three Drei</li>
                </ul>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                <h3 className="mb-2 font-semibold text-white">Backend & Database</h3>
                <ul className="space-y-1 text-sm text-white/90">
                  <li>• Neon (Serverless Postgres)</li>
                  <li>• Drizzle ORM</li>
                  <li>• Next.js Server Actions</li>
                </ul>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 p-4">
                <h3 className="mb-2 font-semibold text-white">3D & Physics</h3>
                <ul className="space-y-1 text-sm text-white/90">
                  <li>• React Three Fiber</li>
                  <li>• React Three Rapier</li>
                  <li>• Three.js</li>
                </ul>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <h3 className="mb-2 font-semibold text-white">Services</h3>
                <ul className="space-y-1 text-sm text-white/90">
                  <li>• Clerk (Authentication)</li>
                  <li>• Neon (Database)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-8 text-center shadow-lg">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to Create Your Unicorn?
            </h2>
            <p className="mb-6 text-lg text-white/90">
              Sign up today and start creating magical unicorns!
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-gray-800 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-white/20 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

