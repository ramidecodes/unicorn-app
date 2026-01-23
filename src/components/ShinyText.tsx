"use client";

import { shaderMaterial, Text3D } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { suspend } from "suspend-react";
import { useRef } from "react";
import * as THREE from "three";

// Rainbow shader material
const RainbowMaterial = shaderMaterial(
  {
    time: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vWorldNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - Rainbow gradient with shiny metallic properties
  `
    uniform float time;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    
    // Convert HSL to RGB
    vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    }
    
    void main() {
      // Create animated rainbow gradient based on position and time
      float hue = mod((vUv.x * 0.5 + vUv.y * 0.3 + time * 0.3) * 0.8, 1.0);
      float saturation = 0.95;
      float lightness = 0.75;
      
      vec3 rainbowColor = hsl2rgb(vec3(hue, saturation, lightness));
      
      // Simple lighting calculation for shiny effect
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float NdotL = max(dot(vWorldNormal, lightDir), 0.0);
      
      // Add specular highlight for metallic shine (simplified)
      float specular = pow(NdotL, 50.0);
      
      // Combine rainbow color with lighting and specular
      vec3 litColor = rainbowColor * (0.4 + 0.6 * NdotL) + vec3(1.0) * specular * 0.9;
      
      // Add some variation based on normal for more depth
      float normalVariation = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.12;
      litColor += normalVariation;
      
      // Enhance brightness for metallic look
      litColor *= 1.4;
      
      // Output color with metallic shine
      gl_FragColor = vec4(clamp(litColor, 0.0, 1.0), 1.0);
    }
  `,
);

// Extend the material so it can be used as a JSX element
extend({ RainbowMaterial });

// Type declaration for TypeScript
declare module "@react-three/fiber" {
  interface ThreeElements {
    rainbowMaterial: any;
  }
}

interface ShinyTextProps {
  text?: string;
  position?: [number, number, number];
  size?: number;
  height?: number;
  curveSegments?: number;
}

export function ShinyText({
  text = "UNICORN",
  position = [0, 3, 0],
  size = 1,
  height = 0.5,
  curveSegments = 12,
}: ShinyTextProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate the rainbow gradient
  useFrame((state) => {
    if (meshRef.current?.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial & {
        uniforms: { time: { value: number } };
      };
      if (material.uniforms?.time) {
        material.uniforms.time.value = state.clock.elapsedTime;
      }
    }
  });

  // Load font from @pmndrs/assets using suspend-react
  const fontData = suspend(
    () => import("@pmndrs/assets/fonts/inter_bold.json"),
    ["@pmndrs/assets/fonts/inter_bold.json"],
  );

  return (
    <Text3D
      ref={meshRef}
      font={fontData.default}
      size={size}
      height={height}
      curveSegments={curveSegments}
      letterSpacing={0.1}
      lineHeight={1}
      position={position}
    >
      {text}
      <rainbowMaterial key={RainbowMaterial.key} />
    </Text3D>
  );
}
