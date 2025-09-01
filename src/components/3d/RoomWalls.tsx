
interface RoomWallsProps {
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
}

const RoomWalls = ({ dimensions }: RoomWallsProps) => {
  const { width, length, height } = dimensions;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#FFFFFF" side={2} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#FFFFFF" side={2} />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#FFFFFF" side={2} />
      </mesh>

      {/* Ceiling (optional, can be hidden) */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#FAFAFA" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export default RoomWalls;
