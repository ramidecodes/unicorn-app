"use client";

import { Physics } from "@react-three/rapier";
import type { ReactNode } from "react";

interface PhysicsWorldProps {
  children: ReactNode;
}

export function PhysicsWorld({ children }: PhysicsWorldProps) {
  return (
    <Physics gravity={[0, 0, 0]} debug={false}>
      {children}
    </Physics>
  );
}
