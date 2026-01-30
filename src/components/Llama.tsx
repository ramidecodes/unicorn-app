"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import type { LlamaFeatures } from "@/lib/llamaFeatures";

interface LlamaProps {
  features: LlamaFeatures;
  position?: [number, number, number];
}

export function Llama({ features, position = [0, 0, 0] }: LlamaProps) {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  const neckRef = useRef<Mesh>(null);

  // Animate llama (gentle bobbing)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    if (neckRef.current) {
      neckRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }
  });

  const bodyColor = features.colorPalette.body;
  const neckColor = features.colorPalette.neck;
  const headColor = features.colorPalette.head;
  const feetColor = features.colorPalette.feet;
  const scale = features.size;

  // Helper function to get fur pattern color (for two-tone and patched)
  const getPatternColor = () => {
    // Create a slightly different shade for patterns
    const hex = bodyColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Return a darker version for contrast
    return `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(
      0,
      b - 30,
    )})`;
  };

  // Helper function for deterministic "random" positions based on index
  const getDeterministicPosition = (index: number, offset: number) => {
    const seed = (index + offset) * 137.508; // Use golden angle for better distribution
    return {
      x: Math.sin(seed) * 1.2,
      y: Math.cos(seed * 0.5) * 0.8,
      z: Math.sin(seed * 0.7) * 0.6,
    };
  };

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body - More rectangular/blocky for llama */}
      <mesh ref={bodyRef} position={[0, 0, 0]} scale={[1.6, 0.9, 0.7]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Fur Pattern Overlay */}
      {features.furPattern === "spotted" && (
        <group>
          {[...Array(8)].map((_, i) => {
            const pos = getDeterministicPosition(i, 100);
            return (
              <mesh
                key={`spot-${i}`}
                position={[pos.x, pos.y, pos.z]}
                scale={[0.15, 0.15, 0.1]}
              >
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={getPatternColor()} />
              </mesh>
            );
          })}
        </group>
      )}
      {features.furPattern === "patched" && (
        <group>
          {/* Front patch */}
          <mesh position={[0.3, 0.2, 0]} scale={[0.4, 0.5, 0.5]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={getPatternColor()} />
          </mesh>
          {/* Back patch */}
          <mesh position={[-0.3, -0.1, 0]} scale={[0.5, 0.4, 0.5]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={getPatternColor()} />
          </mesh>
        </group>
      )}
      {features.furPattern === "two-tone" && (
        <mesh position={[0, 0.2, 0]} scale={[1.6, 0.45, 0.7]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={getPatternColor()} />
        </mesh>
      )}
      {features.furPattern === "freckled" && (
        <group>
          {[...Array(15)].map((_, i) => {
            const pos = getDeterministicPosition(i, 200);
            return (
              <mesh
                key={`freckle-${i}`}
                position={[pos.x, pos.y, pos.z]}
                scale={[0.08, 0.08, 0.05]}
              >
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color={getPatternColor()} />
              </mesh>
            );
          })}
        </group>
      )}
      {features.furPattern === "gradient" && (
        <mesh position={[0, 0, 0]} scale={[1.6, 0.9, 0.7]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={getPatternColor()}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Long Neck - Distinctive llama feature */}
      <mesh
        ref={neckRef}
        position={[0.5, 0.3, 0]}
        rotation={[0, 0, 0.4]}
        scale={[0.45, 1.3, 0.45]}
      >
        <cylinderGeometry args={[0.32, 0.38, 1.0, 16]} />
        <meshStandardMaterial color={neckColor} />
      </mesh>

      {/* Head - Smaller relative to body */}
      <mesh ref={headRef} position={[1.4, 0.8, 0]} scale={[0.9, 0.8, 0.7]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={headColor} />
      </mesh>

      {/* Snout/Muzzle */}
      <mesh position={[1.7, 0.7, 0]} scale={[0.6, 0.45, 0.45]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={headColor} />
      </mesh>

      {/* Ears - Banana-shaped llama ears */}
      <mesh position={[1.3, 0.95, 0.2]} rotation={[-0.4, 0, -0.6]}>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 8]} />
        <meshStandardMaterial color={headColor} />
      </mesh>
      <mesh position={[1.3, 0.95, -0.2]} rotation={[-0.4, 0, 0.6]}>
        <cylinderGeometry args={[0.08, 0.12, 0.4, 8]} />
        <meshStandardMaterial color={headColor} />
      </mesh>

      {/* Eyes */}
      <mesh position={[1.5, 0.85, 0.18]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[1.5, 0.85, -0.18]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Legs - Four legs with feet colors */}
      {[
        [0.5, -0.75, 0.38],
        [-0.5, -0.75, 0.38],
        [0.5, -0.75, -0.38],
        [-0.5, -0.75, -0.38],
      ].map((pos) => (
        <group key={`leg-${pos[0]}-${pos[1]}-${pos[2]}`}>
          {/* Upper leg */}
          <mesh position={[pos[0], pos[1] + 0.2, pos[2]]}>
            <cylinderGeometry args={[0.13, 0.13, 0.5, 8]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[pos[0], pos[1] - 0.15, pos[2]]}>
            <cylinderGeometry args={[0.11, 0.11, 0.4, 8]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          {/* Feet/Hoof - Use feet color */}
          <mesh position={[pos[0], pos[1] - 0.35, pos[2]]}>
            <boxGeometry args={[0.13, 0.08, 0.16]} />
            <meshStandardMaterial color={feetColor} />
          </mesh>
        </group>
      ))}

      {/* Tail - Short stubby tail */}
      <mesh position={[-0.9, -0.05, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Accessories */}
      {/* Hat */}
      {features.accessories.hat === "wizard" && (
        <mesh position={[1.4, 1.0, 0]} rotation={[0, 0, -0.1]}>
          <coneGeometry args={[0.35, 0.45, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}
      {features.accessories.hat === "crown" && (
        <group position={[1.4, 0.9, 0]}>
          {[...Array(5)].map((_, i) => {
            const x = Math.sin((i / 5) * Math.PI * 2) * 0.22;
            const z = Math.cos((i / 5) * Math.PI * 2) * 0.22;
            return (
              <mesh key={`crown-${x}-0-${z}`} position={[x, 0, z]}>
                <boxGeometry args={[0.07, 0.28, 0.07]} />
                <meshStandardMaterial
                  color="#FFD700"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            );
          })}
        </group>
      )}
      {features.accessories.hat === "sombrero" && (
        <group position={[1.4, 0.85, 0]}>
          {/* Brim */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.4, 0.05, 8, 16]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Top */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.3, 8]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        </group>
      )}
      {features.accessories.hat === "beanie" && (
        <mesh position={[1.4, 0.92, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      )}
      {features.accessories.hat === "beret" && (
        <mesh position={[1.4, 0.88, 0]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.25, 0.08, 8, 16]} />
          <meshStandardMaterial color="#E74C3C" />
        </mesh>
      )}
      {features.accessories.hat === "top-hat" && (
        <group position={[1.4, 0.95, 0]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
            <meshStandardMaterial color="#1C1C1C" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 8]} />
            <meshStandardMaterial color="#1C1C1C" />
          </mesh>
        </group>
      )}

      {/* Scarf - Around neck area */}
      {features.accessories.scarf && (
        <mesh position={[0.5, 0.4, 0]} rotation={[Math.PI / 2, 0, 0.4]}>
          <torusGeometry args={[0.35, 0.06, 8, 16]} />
          <meshStandardMaterial
            color={
              features.accessories.scarf === "striped"
                ? "#FF6B6B"
                : features.accessories.scarf === "polka-dot"
                ? "#FFD700"
                : features.accessories.scarf === "checkered"
                ? "#3498DB"
                : "#E74C3C"
            }
          />
        </mesh>
      )}

      {/* Saddle - On back */}
      {features.accessories.saddle === "decorative" && (
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.5]} />
          <meshStandardMaterial
            color="#8B4513"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      )}
      {features.accessories.saddle === "western" && (
        <group position={[0, 0.32, 0]}>
          <mesh>
            <boxGeometry args={[0.65, 0.12, 0.55]} />
            <meshStandardMaterial
              color="#654321"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
          {/* Saddle horn */}
          <mesh position={[0, 0.15, 0.2]}>
            <cylinderGeometry args={[0.04, 0.06, 0.25, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      )}
      {features.accessories.saddle === "colorful" && (
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.5]} />
          <meshStandardMaterial
            color="#FF69B4"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
