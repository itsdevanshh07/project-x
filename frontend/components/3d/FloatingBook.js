"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Book({ color, position, rotation, scale = [1.5, 2.2, 0.2] }) {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            // Gentle floating
            meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1;
            // Slow rotation for depth
            meshRef.current.rotation.y = rotation[1] + t * 0.15;
        }
    });

    return (
        <mesh ref={meshRef} position={position} rotation={rotation}>
            <boxGeometry args={scale} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
        </mesh>
    );
}

export default function FloatingBookScene() {
    return (
        <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-transparent rounded-3xl overflow-hidden">
            <Canvas
                shadows
                camera={{ position: [0, 0, 7], fov: 35 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={150} shadow-bias={-0.001} castShadow />
                <pointLight position={[-10, -5, -10]} intensity={80} color="#6366f1" />

                <group position={[0, -0.2, 0]}>
                    {/* Deep Navy Book */}
                    <Book color="#1e3a8a" position={[0, -0.3, 0]} rotation={[0, -0.1, 0]} />
                    {/* Forest Green Book */}
                    <Book color="#065f46" position={[0.1, 0.2, 0.4]} rotation={[0, 0.2, 0.05]} />
                </group>
            </Canvas>

            {/* Decorative Badge */}
            <div className="absolute top-8 left-8 hidden md:block">
                <div className="px-4 py-2 bg-bg-glass backdrop-blur-xl border border-border-main rounded-full text-[10px] uppercase font-bold tracking-widest text-text-muted">
                    3D Interactive Visual
                </div>
            </div>
        </div>
    );
}
