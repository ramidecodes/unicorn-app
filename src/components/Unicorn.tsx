"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import type { UnicornFeatures } from "@/lib/unicornFeatures";

interface UnicornProps {
  features: UnicornFeatures;
  position?: [number, number, number];
}

export function Unicorn({ features, position = [0, 0, 0] }: UnicornProps) {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  const hornRef = useRef<Mesh>(null);
  const maneRef = useRef<Mesh>(null);
  const tailRef = useRef<Mesh>(null);

  // Animate unicorn (gentle bobbing)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    if (hornRef.current) {
      hornRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
    if (maneRef.current) {
      maneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const bodyColor = features.colorPalette.body;
  const maneColor = features.colorPalette.mane;
  const tailColor = features.colorPalette.tail;
  const hornColor = features.colorPalette.horn;
  const scale = features.size;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body - Elongated ellipsoid for horse-like torso */}
      <mesh ref={bodyRef} position={[0, 0, 0]} scale={[1.5, 0.85, 0.65]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Neck - Distinct neck connecting body to head */}
      <mesh position={[0.6, 0.2, 0]} rotation={[0, 0, 0.3]} scale={[0.5, 1.0, 0.5]}>
        <cylinderGeometry args={[0.35, 0.4, 0.7, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Head - More horse-like, less spherical */}
      <mesh ref={headRef} position={[1.15, 0.5, 0]} scale={[1.1, 0.9, 0.75]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Snout/Muzzle */}
      <mesh position={[1.55, 0.4, 0]} scale={[0.7, 0.5, 0.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Ears - Two triangular ears */}
      <mesh position={[1.05, 0.75, 0.25]} rotation={[-0.3, 0, -0.5]}>
        <coneGeometry args={[0.12, 0.25, 3]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[1.05, 0.75, -0.25]} rotation={[-0.3, 0, 0.5]}>
        <coneGeometry args={[0.12, 0.25, 3]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Eyes - Two eyes */}
      <mesh position={[1.25, 0.55, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[1.25, 0.55, -0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Horn - Larger and more prominent */}
      <mesh ref={hornRef} position={[1.15, 1.0, 0]} rotation={[0, 0, 0.1]}>
        <coneGeometry args={[0.12, 0.9, 8]} />
        <meshStandardMaterial
          color={hornColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Mane - styled based on hairStyle, adjusted for new head position */}
      {features.hairStyle === "curly" && (
        <group ref={maneRef}>
          {[...Array(5)].map((_, i) => {
            const x = 0.85 + i * 0.1;
            const y = 0.5 + Math.sin(i) * 0.2;
            return (
              <mesh
                key={`curly-${x}-${y}`}
                position={[x, y, 0]}
                rotation={[0, 0, Math.sin(i) * 0.3]}
              >
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={maneColor} />
              </mesh>
            );
          })}
        </group>
      )}
      {features.hairStyle === "straight" && (
        <mesh ref={maneRef} position={[0.75, 0.5, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.1]} />
          <meshStandardMaterial color={maneColor} />
        </mesh>
      )}
      {features.hairStyle === "wavy" && (
        <group ref={maneRef}>
          {[...Array(4)].map((_, i) => {
            const x = 0.75 + i * 0.1;
            const y = 0.4 + Math.sin(i * 0.8) * 0.15;
            return (
              <mesh
                key={`wavy-${x}-${y}`}
                position={[x, y, 0]}
                rotation={[0, 0, Math.sin(i * 0.8) * 0.2]}
              >
                <boxGeometry args={[0.1, 0.3, 0.1]} />
                <meshStandardMaterial color={maneColor} />
              </mesh>
            );
          })}
        </group>
      )}
      {features.hairStyle === "spiky" && (
        <group ref={maneRef}>
          {[...Array(6)].map((_, i) => {
            const x = 0.75 + i * 0.08;
            const y = 0.5 + i * 0.1;
            return (
              <mesh
                key={`spiky-${x}-${y}`}
                position={[x, y, 0]}
                rotation={[0, 0, 0.3]}
              >
                <coneGeometry args={[0.08, 0.2, 4]} />
                <meshStandardMaterial color={maneColor} />
              </mesh>
            );
          })}
        </group>
      )}
      {features.hairStyle === "braided" && (
        <group ref={maneRef}>
          {[...Array(3)].map((_, i) => {
            const y = 0.4 + i * 0.15;
            return (
              <mesh
                key={`braided-0.75-${y}`}
                position={[0.75, y, 0]}
                rotation={[0, 0, Math.sin(i) * 0.1]}
              >
                <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
                <meshStandardMaterial color={maneColor} />
              </mesh>
            );
          })}
        </group>
      )}
      {features.hairStyle === "flowing" && (
        <mesh ref={maneRef} position={[0.65, 0.4, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={maneColor} />
        </mesh>
      )}

      {/* Tail - Improved positioning and shape for new body proportions */}
      <mesh ref={tailRef} position={[-1.1, -0.05, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={tailColor} />
      </mesh>
      <mesh position={[-1.3, -0.1, 0]} scale={[0.7, 0.7, 0.7]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={tailColor} />
      </mesh>

      {/* Legs - More proportional and horse-like */}
      {[
        [0.4, -0.75, 0.35],
        [-0.4, -0.75, 0.35],
        [0.4, -0.75, -0.35],
        [-0.4, -0.75, -0.35],
      ].map((pos) => (
        <group key={`leg-${pos[0]}-${pos[1]}-${pos[2]}`}>
          {/* Upper leg */}
          <mesh position={[pos[0], pos[1] + 0.2, pos[2]]}>
            <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[pos[0], pos[1] - 0.15, pos[2]]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          {/* Hoof */}
          <mesh position={[pos[0], pos[1] - 0.35, pos[2]]}>
            <boxGeometry args={[0.12, 0.08, 0.15]} />
            <meshStandardMaterial color="#2C2C2C" />
          </mesh>
        </group>
      ))}

      {/* Accessories - Improved positioning and size for clarity */}
      {features.accessories.hat === "wizard" && (
        <mesh position={[1.15, 0.95, 0]} rotation={[0, 0, -0.1]}>
          <coneGeometry args={[0.4, 0.5, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}
      {features.accessories.hat === "crown" && (
        <group position={[1.15, 0.85, 0]}>
          {[...Array(5)].map((_, i) => {
            const x = Math.sin((i / 5) * Math.PI * 2) * 0.25;
            const z = Math.cos((i / 5) * Math.PI * 2) * 0.25;
            return (
              <mesh key={`crown-${x}-0-${z}`} position={[x, 0, z]}>
                <boxGeometry args={[0.08, 0.3, 0.08]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
              </mesh>
            );
          })}
        </group>
      )}
      {features.accessories.glasses === "sunglasses" && (
        <group position={[1.3, 0.55, 0.25]}>
          <mesh>
            <torusGeometry args={[0.18, 0.03, 8, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.36, 0, 0]}>
            <torusGeometry args={[0.18, 0.03, 8, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.05, 0.02, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      )}
      {features.accessories.jewelry === "necklace" && (
        <mesh position={[0.6, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.04, 8, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      )}
    </group>
  );
}
