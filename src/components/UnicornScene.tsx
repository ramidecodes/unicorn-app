"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { Unicorn } from "@/lib/unicornService";
import type { Llama } from "@/lib/llamaService";
import type { Cat } from "@/lib/catService";
import { Bounds } from "./Bounds";
import { ParticleRainbow } from "./ParticleRainbow";
import { PhysicsUnicorn } from "./PhysicsUnicorn";
import { PhysicsLlama } from "./PhysicsLlama";
import { PhysicsCat } from "./PhysicsCat";
import { PhysicsWorld } from "./PhysicsWorld";
import { ShinyText } from "./ShinyText";

interface UnicornSceneProps {
  unicorns: Unicorn[];
  llamas: Llama[];
  cats: Cat[];
}

export function UnicornScene({ unicorns, llamas, cats }: UnicornSceneProps) {
  return (
    <Canvas className="absolute inset-0">
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, 10, -5]} intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={0.5}
          intensity={1.5}
          castShadow
        />

        <ParticleRainbow />

        <ShinyText
          text="UNICORN"
          position={[0, 4, 0]}
          size={1.5}
          height={0.3}
        />

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
          {llamas.map((llama) => (
            <PhysicsLlama
              key={llama.id}
              id={llama.id}
              features={llama.features}
              position={[llama.position.x, llama.position.y, llama.position.z]}
              velocity={[llama.velocity.x, llama.velocity.y, llama.velocity.z]}
            />
          ))}
          {cats.map((cat) => (
            <PhysicsCat
              key={cat.id}
              id={cat.id}
              features={cat.features}
              position={[cat.position.x, cat.position.y, cat.position.z]}
              velocity={[cat.velocity.x, cat.velocity.y, cat.velocity.z]}
            />
          ))}
        </PhysicsWorld>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Suspense>
    </Canvas>
  );
}
