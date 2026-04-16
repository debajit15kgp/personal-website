import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import type { Branch } from '../data';
import { branchColor, useTheme } from '../lib/theme';

// Different geometric shape per branch — lets the 3D hero feel tied to the algorithm.
function branchGeometry(branch: Branch) {
  switch (branch) {
    case 'foundation':
      return <icosahedronGeometry args={[1.2, 0]} />;
    case 'policy-gradient':
      return <octahedronGeometry args={[1.3, 0]} />;
    case 'actor-critic':
      return <dodecahedronGeometry args={[1.1, 0]} />;
    case 'trust-region':
      return <torusKnotGeometry args={[0.85, 0.28, 128, 16, 2, 3]} />;
    case 'value':
      return <tetrahedronGeometry args={[1.4, 0]} />;
    case 'continuous':
      return <torusGeometry args={[0.9, 0.28, 24, 64]} />;
    case 'model-based':
      return <sphereGeometry args={[1.1, 24, 16]} />;
    case 'offline':
      return <coneGeometry args={[1.1, 1.8, 8]} />;
    default:
      return <boxGeometry args={[1.4, 1.4, 1.4]} />;
  }
}

function SpinningShape({ branch, color }: { branch: Branch; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.25;
    ref.current.rotation.y += delta * 0.35;
  });
  return (
    <mesh ref={ref}>
      {branchGeometry(branch)}
      <meshStandardMaterial
        color={color}
        wireframe
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

export default function HeroScene({ branch }: { branch: Branch }) {
  const { theme } = useTheme();
  const color = branchColor(branch, theme);
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={theme === 'dark' ? 0.6 : 0.9} />
      <pointLight position={[5, 5, 5]} intensity={theme === 'dark' ? 0.8 : 1.2} />
      <pointLight position={[-5, -3, 2]} intensity={0.4} color={color} />
      <SpinningShape branch={branch} color={color} />
    </Canvas>
  );
}
