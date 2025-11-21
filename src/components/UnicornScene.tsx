"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { Unicorn } from "@/lib/unicornService";
import { Bounds } from "./Bounds";
import { ParticleRainbow } from "./ParticleRainbow";
import { PhysicsUnicorn } from "./PhysicsUnicorn";
import { PhysicsWorld } from "./PhysicsWorld";

interface UnicornSceneProps {
  unicorns: Unicorn[];
}

export function UnicornScene({ unicorns }: UnicornSceneProps) {
  return (
    <Canvas className="absolute inset-0">
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <ParticleRainbow />

        <PhysicsWorld>
          <Bounds />
          {unicorns.map((unicorn) => (
            <PhysicsUnicorn
              key={unicorn.id}
              id={unicorn.id}
              features={unicorn.features}
              position={[
                unicorn.position.x,
                unicorn.position.y,
                unicorn.position.z,
              ]}
              velocity={[
                unicorn.velocity.x,
                unicorn.velocity.y,
                unicorn.velocity.z,
              ]}
            />
          ))}
        </PhysicsWorld>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Suspense>
    </Canvas>
  );
}
