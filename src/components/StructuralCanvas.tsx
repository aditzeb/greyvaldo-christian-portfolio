import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface StructuralCanvasProps {
  scrollProgress: number;
  activeStageOverride?: number | null;
  onNodeHover?: (telemetry: string | null) => void;
}

/**
 * Stage 1 (0% - 25% Scroll):
 * Long-Span Highway Flyover & Box-Girder Bridge Truss Wireframe (IKN Fly Over)
 */
const BridgeFlyoverTruss: React.FC<{
  weight: number;
  isMobile: boolean;
  onNodeHover?: (telemetry: string | null) => void;
}> = ({ weight, isMobile, onNodeHover }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { lineGeometry, structuralNodes } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const nodes: { pos: [number, number, number]; label: string }[] = [];

    const spans = 12;
    const spanLength = 2.2;
    const deckWidth = 3.2;
    const trussHeight = 1.35;
    const startX = -(spans * spanLength) / 2;

    for (let i = 0; i <= spans; i++) {
      const x = startX + i * spanLength;
      const camber = Math.sin((i / spans) * Math.PI) * 1.1;
      const yTop = camber + trussHeight / 2;
      const yBot = camber - trussHeight / 2;
      const zFront = deckWidth / 2;
      const zBack = -deckWidth / 2;
      const zBotFront = deckWidth * 0.32;
      const zBotBack = -deckWidth * 0.32;

      // Cross-frame trapezoid (Box-Girder cross section)
      points.push(new THREE.Vector3(x, yTop, zFront), new THREE.Vector3(x, yTop, zBack));
      points.push(new THREE.Vector3(x, yBot, zBotFront), new THREE.Vector3(x, yBot, zBotBack));
      points.push(new THREE.Vector3(x, yTop, zFront), new THREE.Vector3(x, yBot, zBotFront));
      points.push(new THREE.Vector3(x, yTop, zBack), new THREE.Vector3(x, yBot, zBotBack));
      points.push(new THREE.Vector3(x, yTop, zFront), new THREE.Vector3(x, yBot, zBotBack));

      nodes.push({
        pos: [x, yTop, zFront],
        label: `NODE-B${i}F // STA 0+${i * 50} // V=${(850 + i * 18).toFixed(0)}kN`,
      });
      if (i % 2 === 0) {
        nodes.push({
          pos: [x, yBot, zBotFront],
          label: `SOFFIT-S${i} // M=${(1420 + i * 35).toFixed(0)}kNm`,
        });
      }

      // Reinforced concrete pier columns every 3 spans
      if (i % 3 === 0 && i > 0 && i < spans) {
        const pierBottom = -3.2;
        points.push(new THREE.Vector3(x, yBot, zBotFront), new THREE.Vector3(x, pierBottom, zBotFront));
        points.push(new THREE.Vector3(x, yBot, zBotBack), new THREE.Vector3(x, pierBottom, zBotBack));
        points.push(new THREE.Vector3(x, pierBottom, zBotFront), new THREE.Vector3(x, pierBottom, zBotBack));
        points.push(new THREE.Vector3(x - 0.6, pierBottom, zBotFront + 0.4), new THREE.Vector3(x + 0.6, pierBottom, zBotFront + 0.4));
        points.push(new THREE.Vector3(x - 0.6, pierBottom, zBotBack - 0.4), new THREE.Vector3(x + 0.6, pierBottom, zBotBack - 0.4));
        nodes.push({
          pos: [x, pierBottom, zBotFront],
          label: `PIER-P${i / 3} // PILECAP FC' 45MPa // PASS`,
        });
      }

      // Longitudinal chords & Warren truss diagonals
      if (i < spans) {
        const nextX = startX + (i + 1) * spanLength;
        const nextCamber = Math.sin(((i + 1) / spans) * Math.PI) * 1.1;
        const nextYTop = nextCamber + trussHeight / 2;
        const nextYBot = nextCamber - trussHeight / 2;

        points.push(new THREE.Vector3(x, yTop, zFront), new THREE.Vector3(nextX, nextYTop, zFront));
        points.push(new THREE.Vector3(x, yTop, zBack), new THREE.Vector3(nextX, nextYTop, zBack));
        points.push(new THREE.Vector3(x, yTop, 0), new THREE.Vector3(nextX, nextYTop, 0));

        points.push(new THREE.Vector3(x, yBot, zBotFront), new THREE.Vector3(nextX, nextYBot, zBotFront));
        points.push(new THREE.Vector3(x, yBot, zBotBack), new THREE.Vector3(nextX, nextYBot, zBotBack));

        points.push(new THREE.Vector3(x, yTop, zFront), new THREE.Vector3(nextX, nextYBot, zBotFront));
        points.push(new THREE.Vector3(x, yBot, zBotFront), new THREE.Vector3(nextX, nextYTop, zFront));
        points.push(new THREE.Vector3(x, yTop, zBack), new THREE.Vector3(nextX, nextYBot, zBotBack));
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return { lineGeometry: geometry, structuralNodes: nodes };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.14) * 0.12 - (isMobile ? 0.52 : 0.32);
    groupRef.current.position.y = (1 - weight) * 4.5 + (isMobile ? 0.4 : 0);
    const mobileScale = isMobile ? 0.65 : 1;
    groupRef.current.scale.setScalar(Math.max(0.001, weight * mobileScale));
  });

  if (weight <= 0.02) return null;

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#8F8F8F" transparent opacity={0.34 * weight} />
      </lineSegments>

      {structuralNodes.map((node, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <mesh
            key={idx}
            position={node.pos}
            onPointerOver={(e) => {
              if (isMobile) return;
              e.stopPropagation();
              setHoveredIdx(idx);
              onNodeHover?.(node.label);
            }}
            onPointerOut={() => {
              if (isMobile) return;
              setHoveredIdx(null);
              onNodeHover?.(null);
            }}
          >
            <boxGeometry args={isHovered ? [0.22, 0.22, 0.22] : [0.11, 0.11, 0.11]} />
            <meshBasicMaterial
              color="#0070F3"
              transparent
              opacity={(isHovered ? 1.0 : 0.85) * weight}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Stage 2 (25% - 55% Scroll):
 * 7+ KM Rigid Pavement & Steel-Reinforced Concrete Foundation Matrix
 */
const RigidPavementMatrix: React.FC<{
  weight: number;
  scrollProgress: number;
  isMobile: boolean;
  onNodeHover?: (telemetry: string | null) => void;
}> = ({ weight, scrollProgress, isMobile, onNodeHover }) => {
  const groupRef = useRef<THREE.Group>(null);

  const { rebarGeo, slabGeo, checkpoints } = useMemo(() => {
    const rebarPoints: THREE.Vector3[] = [];
    const slabPoints: THREE.Vector3[] = [];
    const cps: { pos: [number, number, number]; sta: string; zone: string }[] = [];

    const length = 26;
    const width = 7;
    const longitudinalBars = 14;
    const transverseJoints = 20;

    for (const yLayer of [-0.25, 0.25]) {
      for (let i = 0; i <= longitudinalBars; i++) {
        const x = -width / 2 + (i / longitudinalBars) * width;
        rebarPoints.push(
          new THREE.Vector3(x, yLayer, -length / 2),
          new THREE.Vector3(x, yLayer, length / 2)
        );
      }
      for (let j = 0; j <= transverseJoints; j++) {
        const z = -length / 2 + (j / transverseJoints) * length;
        rebarPoints.push(
          new THREE.Vector3(-width / 2, yLayer, z),
          new THREE.Vector3(width / 2, yLayer, z)
        );
      }
    }

    for (let j = 0; j <= transverseJoints; j++) {
      const z = -length / 2 + (j / transverseJoints) * length;
      slabPoints.push(new THREE.Vector3(-width / 2 - 0.5, -0.55, z), new THREE.Vector3(width / 2 + 0.5, -0.55, z));
      slabPoints.push(new THREE.Vector3(-width / 2, -0.25, z), new THREE.Vector3(-width / 2, 0.25, z));
      slabPoints.push(new THREE.Vector3(width / 2, -0.25, z), new THREE.Vector3(width / 2, 0.25, z));

      if (j % 3 === 0) {
        const km = Math.min(7, Math.floor((j / transverseJoints) * 7));
        const m = Math.floor(((j / transverseJoints) * 7000) % 1000)
          .toString()
          .padStart(3, '0');
        cps.push({
          pos: [width / 2 + 0.4, 0.35, z],
          sta: `STA ${km}+${m}`,
          zone: `ZONE 0${Math.min(6, km + 1)} // FS 4.5 MPa`,
        });
      }
    }

    return {
      rebarGeo: new THREE.BufferGeometry().setFromPoints(rebarPoints),
      slabGeo: new THREE.BufferGeometry().setFromPoints(slabPoints),
      checkpoints: cps,
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const localProgress = THREE.MathUtils.clamp((scrollProgress - 0.2) / 0.4, 0, 1);
    groupRef.current.position.z = (localProgress - 0.5) * 9.5;
    groupRef.current.position.y = -0.8 + Math.sin(t * 0.25) * 0.08;
    groupRef.current.rotation.y = -0.35 + localProgress * 0.25;
    groupRef.current.rotation.x = 0.22;
    const mobileScale = isMobile ? 0.68 : 1;
    groupRef.current.scale.setScalar(Math.max(0.001, weight * mobileScale));
  });

  if (weight <= 0.02) return null;

  return (
    <group ref={groupRef}>
      <lineSegments geometry={rebarGeo}>
        <lineBasicMaterial color="#8F8F8F" transparent opacity={0.28 * weight} />
      </lineSegments>

      <lineSegments geometry={slabGeo}>
        <lineBasicMaterial color="#0070F3" transparent opacity={0.42 * weight} />
      </lineSegments>

      {checkpoints.map((cp, idx) => (
        <group key={idx} position={cp.pos}>
          <mesh
            onPointerOver={(e) => {
              if (isMobile) return;
              e.stopPropagation();
              onNodeHover?.(`${cp.sta} // ${cp.zone} // ITP VERIFIED`);
            }}
            onPointerOut={() => {
              if (isMobile) return;
              onNodeHover?.(null);
            }}
          >
            <octahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color="#0070F3" wireframe transparent opacity={0.95 * weight} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Stage 3 (55% - 100% Scroll):
 * Structural Finite Element (SAP2000-style) Geodesic Space-Frame Mesh
 */
const FiniteElementMesh: React.FC<{
  weight: number;
  isMobile: boolean;
}> = ({ weight, isMobile }) => {
  const meshGroupRef = useRef<THREE.Group>(null);

  const { wireframeGeo, telemetryNodes } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(3.4, 2);
    const edges = new THREE.EdgesGeometry(ico);

    const labels = [
      {
        pos: [2.1, 1.6, 1.2] as [number, number, number],
        code: 'FEM-NODE #104',
        vec: 'σx: +142.4 MPa | Δz: -1.8mm',
      },
      {
        pos: [-2.2, 1.0, 1.5] as [number, number, number],
        code: 'FEM-NODE #218',
        vec: 'σy: +98.2 MPa | SF: 2.45',
      },
      {
        pos: [0.4, -2.1, 1.9] as [number, number, number],
        code: 'SAP2000 // SHELL-09',
        vec: 'Mmax: 640 kNm | PASS',
      },
    ];

    return { wireframeGeo: edges, telemetryNodes: labels };
  }, []);

  useFrame((state) => {
    if (!meshGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    meshGroupRef.current.rotation.y = t * 0.12;
    meshGroupRef.current.rotation.x = Math.sin(t * 0.18) * 0.15;
    const mobileScale = isMobile ? 0.65 : 1;
    meshGroupRef.current.scale.setScalar(Math.max(0.001, weight * mobileScale));
  });

  if (weight <= 0.02) return null;

  return (
    <group ref={meshGroupRef}>
      <lineSegments geometry={wireframeGeo}>
        <lineBasicMaterial color="#8F8F8F" transparent opacity={0.32 * weight} />
      </lineSegments>

      <mesh>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial color="#0070F3" wireframe transparent opacity={0.22 * weight} />
      </mesh>

      {telemetryNodes.map((node, i) => (
        <group key={i} position={node.pos}>
          <mesh>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#0070F3" transparent opacity={weight} />
          </mesh>
          {/* On mobile, show only the primary node label so 3D badges never crowd narrow viewports */}
          {weight > 0.45 && (!isMobile || i === 0) && (
            <Html distanceFactor={isMobile ? 15 : 12} position={[0.15, 0.15, 0]} style={{ pointerEvents: 'none' }}>
              <div className="bg-[#0A0A0A]/90 border border-[#1F1F1F] px-2 py-1 rounded-[6px] whitespace-nowrap">
                <div className="font-mono text-[9px] sm:text-[10px] text-[#0070F3] leading-tight">{node.code}</div>
                <div className="font-mono text-[8px] sm:text-[9px] text-[#8F8F8F] leading-tight">{node.vec}</div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
};

/**
 * Orthographic CAD Ground & Responsive Camera Controller
 */
const OrthographicCadGrid: React.FC<{ scrollProgress: number; isMobile: boolean }> = ({
  scrollProgress,
  isMobile,
}) => {
  const gridRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    const baseZ = isMobile ? 11.8 : 9.5;
    const targetZ = baseZ - scrollProgress * 1.2;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      isMobile ? 0 : state.pointer.x * 0.45,
      0.05
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      isMobile ? 0.3 : state.pointer.y * 0.3,
      0.05
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={gridRef} position={[0, -3.4, 0]}>
      <gridHelper args={[44, 44, '#1F1F1F', '#111111']} />
    </group>
  );
};

export const StructuralCanvas: React.FC<StructuralCanvasProps> = ({
  scrollProgress,
  activeStageOverride,
  onNodeHover,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { w1, w2, w3 } = useMemo(() => {
    if (activeStageOverride === 1) return { w1: 1, w2: 0, w3: 0 };
    if (activeStageOverride === 2) return { w1: 0, w2: 1, w3: 0 };
    if (activeStageOverride === 3) return { w1: 0, w2: 0, w3: 1 };

    const p = scrollProgress;
    const stage1 = p <= 0.22 ? 1 : Math.max(0, 1 - (p - 0.22) / 0.12);
    const stage2 =
      p < 0.18
        ? 0
        : p <= 0.28
        ? (p - 0.18) / 0.1
        : p <= 0.52
        ? 1
        : Math.max(0, 1 - (p - 0.52) / 0.12);
    const stage3 = p < 0.48 ? 0 : Math.min(1, (p - 0.48) / 0.14);

    return { w1: stage1, w2: stage2, w3: stage3 };
  }, [scrollProgress, activeStageOverride]);

  return (
    <div
      className={`fixed inset-0 z-0 bg-[#000000] ${
        isMobile ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.6, 9.5], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 1);
        }}
      >
        <OrthographicCadGrid scrollProgress={scrollProgress} isMobile={isMobile} />
        <BridgeFlyoverTruss weight={w1} isMobile={isMobile} onNodeHover={onNodeHover} />
        <RigidPavementMatrix
          weight={w2}
          scrollProgress={scrollProgress}
          isMobile={isMobile}
          onNodeHover={onNodeHover}
        />
        <FiniteElementMesh weight={w3} isMobile={isMobile} />
      </Canvas>
    </div>
  );
};
