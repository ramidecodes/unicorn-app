"use client";

import { type RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import type { CatFeatures } from "@/lib/catFeatures";
import { Cat } from "./Cat";

interface PhysicsCatProps {
  features: CatFeatures;
  position: [number, number, number];
  velocity: [number, number, number];
  id: string;
}

export function PhysicsCat({ features, position, velocity }: PhysicsCatProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (rigidBodyRef.current) {
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
      restitution={1.0}
      friction={0}
      linearDamping={0}
      angularDamping={0}
    >
      <Cat features={features} position={[0, 0, 0]} />
    </RigidBody>
  );
}
