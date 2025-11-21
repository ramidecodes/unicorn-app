"use client";

import { RigidBody } from "@react-three/rapier";

const BOUNDS = 10;
const WALL_THICKNESS = 0.1;

export function Bounds() {
  return (
    <>
      {/* Left wall */}
      <RigidBody type="fixed" position={[-BOUNDS - WALL_THICKNESS / 2, 0, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[WALL_THICKNESS, BOUNDS * 2, BOUNDS * 2]} />
        </mesh>
      </RigidBody>

      {/* Right wall */}
      <RigidBody type="fixed" position={[BOUNDS + WALL_THICKNESS / 2, 0, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[WALL_THICKNESS, BOUNDS * 2, BOUNDS * 2]} />
        </mesh>
      </RigidBody>

      {/* Top wall */}
      <RigidBody type="fixed" position={[0, BOUNDS + WALL_THICKNESS / 2, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[BOUNDS * 2, WALL_THICKNESS, BOUNDS * 2]} />
        </mesh>
      </RigidBody>

      {/* Bottom wall */}
      <RigidBody type="fixed" position={[0, -BOUNDS - WALL_THICKNESS / 2, 0]}>
        <mesh visible={false}>
          <boxGeometry args={[BOUNDS * 2, WALL_THICKNESS, BOUNDS * 2]} />
        </mesh>
      </RigidBody>

      {/* Front wall */}
      <RigidBody type="fixed" position={[0, 0, BOUNDS + WALL_THICKNESS / 2]}>
        <mesh visible={false}>
          <boxGeometry args={[BOUNDS * 2, BOUNDS * 2, WALL_THICKNESS]} />
        </mesh>
      </RigidBody>

      {/* Back wall */}
      <RigidBody type="fixed" position={[0, 0, -BOUNDS - WALL_THICKNESS / 2]}>
        <mesh visible={false}>
          <boxGeometry args={[BOUNDS * 2, BOUNDS * 2, WALL_THICKNESS]} />
        </mesh>
      </RigidBody>
    </>
  );
}
