"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { CatFeatures } from "@/lib/catFeatures";

interface CatProps {
  features: CatFeatures;
  position?: [number, number, number];
}

export function Cat({ features, position = [0, 0, 0] }: CatProps) {
  const groupRef = useRef<Group>(null);
  const tailRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2.2) * 0.08;
    }

    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  const bodyColor = features.colorPalette.body;
  const earsColor = features.colorPalette.ears;
  const pawsColor = features.colorPalette.paws;
  const eyesColor = features.colorPalette.eyes;
  const scale = features.size;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[1.4, 0.8, 0.7]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Head */}
      <mesh position={[0.9, 0.35, 0]} scale={[0.9, 0.9, 0.8]}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Ears */}
      <mesh position={[0.75, 0.75, 0.2]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.12, 0.28, 4]} />
        <meshStandardMaterial color={earsColor} />
      </mesh>
      <mesh position={[0.75, 0.75, -0.2]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.12, 0.28, 4]} />
        <meshStandardMaterial color={earsColor} />
      </mesh>

      {/* Eyes */}
      <mesh position={[1.05, 0.4, 0.14]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={eyesColor} />
      </mesh>
      <mesh position={[1.05, 0.4, -0.14]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={eyesColor} />
      </mesh>

      {/* Nose */}
      <mesh position={[1.25, 0.24, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#FF9AA2" />
      </mesh>

      {/* Paws */}
      {[
        [0.4, -0.62, 0.28],
        [-0.2, -0.62, 0.28],
        [0.4, -0.62, -0.28],
        [-0.2, -0.62, -0.28],
      ].map((paw) => (
        <group key={`paw-${paw[0]}-${paw[1]}-${paw[2]}`}>
          <mesh position={[paw[0], paw[1] + 0.12, paw[2]]}>
            <cylinderGeometry args={[0.1, 0.1, 0.25, 8]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          <mesh position={[paw[0], paw[1] - 0.05, paw[2]]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={pawsColor} />
          </mesh>
        </group>
      ))}

      {/* Tail */}
      <group ref={tailRef} position={[-0.95, 0.15, 0]} rotation={[0, 0, 0.45]}>
        <mesh position={[-0.2, 0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.5, 10]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[-0.4, 0.4, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.05, 0.06, 0.45, 10]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>

      {/* Fur pattern overlays */}
      {features.furPattern === "striped" && (
        <group>
          {[-0.4, -0.1, 0.2, 0.5].map((x) => (
            <mesh
              key={`stripe-${x}`}
              position={[x, 0.15, 0]}
              scale={[0.08, 0.55, 0.75]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#2C2C2C"
                transparent
                opacity={0.35}
              />
            </mesh>
          ))}
        </group>
      )}
      {features.furPattern === "spotted" && (
        <group>
          {[
            [-0.3, 0.2, 0.2],
            [0.1, 0.0, -0.2],
            [0.35, 0.2, 0.1],
            [-0.1, -0.1, -0.15],
          ].map((spot) => (
            <mesh
              key={`spot-${spot[0]}-${spot[1]}-${spot[2]}`}
              position={[spot[0], spot[1], spot[2]]}
              scale={[0.18, 0.15, 0.12]}
            >
              <sphereGeometry args={[0.35, 12, 12]} />
              <meshStandardMaterial color="#1E1E1E" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      )}
      {features.furPattern === "tuxedo" && (
        <mesh position={[0.35, 0.05, 0]} scale={[0.55, 0.62, 0.42]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.65} />
        </mesh>
      )}
      {features.furPattern === "calico" && (
        <group>
          <mesh position={[-0.2, 0.1, 0.2]} scale={[0.28, 0.2, 0.2]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#D2691E" transparent opacity={0.45} />
          </mesh>
          <mesh position={[0.25, -0.05, -0.1]} scale={[0.3, 0.25, 0.22]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#2F2F2F" transparent opacity={0.4} />
          </mesh>
        </group>
      )}
      {features.furPattern === "tabby" && (
        <group>
          {[-0.25, 0.05, 0.35].map((x) => (
            <mesh
              key={`tabby-${x}`}
              position={[x, 0.22, 0]}
              scale={[0.1, 0.42, 0.7]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#654321"
                transparent
                opacity={0.35}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Accessories */}
      {features.accessories.collar && (
        <mesh position={[0.72, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 16]} />
          <meshStandardMaterial
            color={
              features.accessories.collar === "red"
                ? "#E63946"
                : features.accessories.collar === "blue"
                  ? "#3A86FF"
                  : features.accessories.collar === "purple"
                    ? "#8338EC"
                    : "#FF006E"
            }
          />
        </mesh>
      )}
      {features.accessories.bow && (
        <group position={[0.72, 0.25, 0.23]}>
          <mesh position={[-0.05, 0, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
        </group>
      )}
      {features.accessories.bell && (
        <mesh position={[0.9, 0.1, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial
            color={features.accessories.bell === "gold" ? "#FFD700" : "#C0C0C0"}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
}
