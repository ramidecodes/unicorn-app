"use client";

import { type RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import type { LlamaFeatures } from "@/lib/llamaFeatures";
import { Llama } from "./Llama";

interface PhysicsLlamaProps {
  features: LlamaFeatures;
  position: [number, number, number];
  velocity: [number, number, number];
  id: string;
}

export function PhysicsLlama({
  features,
  position,
  velocity,
}: PhysicsLlamaProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (rigidBodyRef.current) {
      // Set initial velocity
      rigidBodyRef.current.setLinvel(
        { x: velocity[0], y: velocity[1], z: velocity[2] },
        true,
      );
    }
  }, [velocity]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      type="dynamic"
      colliders="ball"
      restitution={1.0} // Full bounce
      friction={0}
      linearDamping={0} // No damping for continuous bouncing
      angularDamping={0}
    >
      <Llama features={features} position={[0, 0, 0]} />
    </RigidBody>
  );
}

