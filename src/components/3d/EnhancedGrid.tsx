import { useMemo } from 'react';
import { Grid, Text } from '@react-three/drei';

interface EnhancedGridProps {
  size?: number;
  divisions?: number;
  showMeasurements?: boolean;
  roomDimensions?: {
    width: number;
    length: number;
  };
}

const EnhancedGrid = ({ 
  size = 20, 
  divisions = 20, 
  showMeasurements = true,
  roomDimensions = { width: 6, length: 8 }
}: EnhancedGridProps) => {
  // Generate measurement labels
  const measurements = useMemo(() => {
    const labels = [];
    const step = size / divisions;
    
    // X-axis measurements
    for (let i = 0; i <= divisions; i += 2) {
      const x = (i - divisions / 2) * step;
      if (x !== 0) {
        labels.push({
          position: [x, 0.1, -size / 2 - 1] as [number, number, number],
          text: `${Math.abs(x).toFixed(1)}m`,
          rotation: [-Math.PI / 2, 0, 0] as [number, number, number]
        });
      }
    }
    
    // Z-axis measurements
    for (let i = 0; i <= divisions; i += 2) {
      const z = (i - divisions / 2) * step;
      if (z !== 0) {
        labels.push({
          position: [-size / 2 - 1, 0.1, z] as [number, number, number],
          text: `${Math.abs(z).toFixed(1)}m`,
          rotation: [-Math.PI / 2, 0, Math.PI / 2] as [number, number, number]
        });
      }
    }
    
    return labels;
  }, [size, divisions]);

  return (
    <group>
      {/* Main grid */}
      <Grid
        args={[size, size]}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        infiniteGrid={false}
        fadeDistance={30}
        fadeStrength={1}
        cellSize={1}
        sectionSize={5}
        cellThickness={0.5}
        sectionThickness={1}
        cellColor={'#e0e0e0'}
        sectionColor={'#999999'}
      />
      
      {/* Room boundary outline */}
      <lineSegments position={[0, 0.01, 0]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={5}
            array={new Float32Array([
              -roomDimensions.width / 2, 0, -roomDimensions.length / 2,
              roomDimensions.width / 2, 0, -roomDimensions.length / 2,
              roomDimensions.width / 2, 0, roomDimensions.length / 2,
              -roomDimensions.width / 2, 0, roomDimensions.length / 2,
              -roomDimensions.width / 2, 0, -roomDimensions.length / 2,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#ff6b6b" linewidth={3} />
      </lineSegments>
      
      {/* Measurement labels */}
      {showMeasurements && measurements.map((label, index) => (
        <Text
          key={index}
          position={label.position}
          rotation={label.rotation}
          fontSize={0.3}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}
      
      {/* Origin marker */}
      <mesh position={[0, 0.02, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
    </group>
  );
};

export default EnhancedGrid;
