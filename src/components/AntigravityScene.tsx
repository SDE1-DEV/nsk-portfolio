import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

const FloatingShape = ({
  position,
  geometry,
  color,
  speed,
  distort,
  scale,
}: {
  position: [number, number, number];
  geometry: "sphere" | "torus" | "octahedron" | "icosahedron" | "torusKnot" | "dodecahedron" | "cone" | "cylinder";
  color: string;
  speed: number;
  distort: number;
  scale: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * speed + position[0]) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.5 + position[2]) * 0.2;
    meshRef.current.rotation.x = t * speed * 0.3;
    meshRef.current.rotation.z = t * speed * 0.2;

    const s = hovered ? scale * 1.3 : scale;
    meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
  });

  const geo = useMemo(() => {
    switch (geometry) {
      case "sphere": return <sphereGeometry args={[1, 32, 32]} />;
      case "torus": return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case "octahedron": return <octahedronGeometry args={[1, 0]} />;
      case "icosahedron": return <icosahedronGeometry args={[1, 0]} />;
      case "torusKnot": return <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />;
      case "dodecahedron": return <dodecahedronGeometry args={[1, 0]} />;
      case "cone": return <coneGeometry args={[1, 2, 6]} />;
      case "cylinder": return <cylinderGeometry args={[0.5, 0.5, 2, 8]} />;
    }
  }, [geometry]);

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {geo}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={hovered ? 0.35 : 0.15}
          distort={hovered ? distort * 1.5 : distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={Math.random() > 0.5}
        />
      </mesh>
    </Float>
  );
};

const WobbleShape = ({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.5;
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshWobbleMaterial
        color={color}
        transparent
        opacity={0.1}
        factor={0.6}
        speed={speed}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
};

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.01) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d4ff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const MouseLight = () => {
  const lightRef = useRef<THREE.PointLight>(null!);
  const { viewport } = useThree();

  useFrame((state) => {
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    lightRef.current.position.set(x, y, 3);
  });

  return <pointLight ref={lightRef} color="#00d4ff" intensity={2} distance={8} />;
};

const Scene = () => {
  const shapes: {
    position: [number, number, number];
    geometry: "sphere" | "torus" | "octahedron" | "icosahedron" | "torusKnot" | "dodecahedron" | "cone" | "cylinder";
    color: string;
    speed: number;
    distort: number;
    scale: number;
  }[] = useMemo(
    () => [
      { position: [-5, 2, -3], geometry: "torusKnot", color: "#00d4ff", speed: 0.4, distort: 0.3, scale: 0.5 },
      { position: [5, -1, -4], geometry: "icosahedron", color: "#7c3aed", speed: 0.6, distort: 0.4, scale: 0.7 },
      { position: [-3, -3, -2], geometry: "octahedron", color: "#00d4ff", speed: 0.5, distort: 0.2, scale: 0.6 },
      { position: [4, 3, -5], geometry: "torus", color: "#7c3aed", speed: 0.3, distort: 0.3, scale: 0.5 },
      { position: [0, 4, -6], geometry: "dodecahedron", color: "#00d4ff", speed: 0.35, distort: 0.25, scale: 0.4 },
      { position: [-6, 0, -4], geometry: "sphere", color: "#7c3aed", speed: 0.45, distort: 0.5, scale: 0.8 },
      { position: [6, 1, -3], geometry: "cone", color: "#00d4ff", speed: 0.55, distort: 0.2, scale: 0.5 },
      { position: [2, -4, -5], geometry: "cylinder", color: "#7c3aed", speed: 0.4, distort: 0.15, scale: 0.4 },
      { position: [-2, 3, -7], geometry: "torusKnot", color: "#00d4ff", speed: 0.3, distort: 0.35, scale: 0.35 },
      { position: [3, -2, -2], geometry: "icosahedron", color: "#7c3aed", speed: 0.5, distort: 0.3, scale: 0.45 },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#00d4ff" />
      <directionalLight position={[-5, -5, 5]} intensity={0.2} color="#7c3aed" />
      <MouseLight />

      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}

      <WobbleShape position={[-4, -2, -8]} color="#00d4ff" scale={1.5} speed={0.3} />
      <WobbleShape position={[4, 2, -9]} color="#7c3aed" scale={1.2} speed={0.25} />

      <ParticleField />

      <fog attach="fog" args={["#0a0b14", 5, 25]} />
    </>
  );
};

const AntigravityScene = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default AntigravityScene;
