import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3, Vector2, Raycaster, Plane } from 'three';
import { FurnitureObject } from './Room3D';

interface FurnitureItemProps {
  furniture: FurnitureObject;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<FurnitureObject>) => void;
}

const FurnitureItem = ({ furniture, isSelected, onClick, onUpdate }: FurnitureItemProps) => {
  const groupRef = useRef<Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragOffset, setDragOffset] = useState<Vector3>(new Vector3());
  const { camera, gl } = useThree();

  const getMaterialProps = () => {
    const baseProps = {
      color: furniture.color,
    };

    switch (furniture.material) {
      case 'wood':
        return {
          ...baseProps,
          roughness: 0.8,
          metalness: 0.1,
        };
      case 'metal':
        return {
          ...baseProps,
          roughness: 0.3,
          metalness: 0.8,
        };
      case 'fabric':
        return {
          ...baseProps,
          roughness: 0.9,
          metalness: 0.0,
        };
      case 'leather':
        return {
          ...baseProps,
          roughness: 0.6,
          metalness: 0.1,
        };
      case 'glass':
        return {
          ...baseProps,
          roughness: 0.1,
          metalness: 0.0,
          transparent: true,
          opacity: 0.8,
        };
      default:
        return baseProps;
    }
  };

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    // Check if shift key is pressed for rotation
    if (event.nativeEvent?.shiftKey) {
      setIsRotating(true);
      document.dispatchEvent(new CustomEvent('furniture-drag-start'));
    } else {
      setIsDragging(true);
      document.dispatchEvent(new CustomEvent('furniture-drag-start'));
      
      // Calculate offset between click point and object center
      const objectPosition = new Vector3(...furniture.position);
      const clickPoint = event.point;
      setDragOffset(objectPosition.clone().sub(clickPoint));
    }
    
    onClick();
    
    // Set dragging attribute using userData for camera controls
    if (groupRef.current) {
      groupRef.current.userData.furnitureDragging = true;
    }
    
    gl.domElement.style.cursor = isRotating ? 'crosshair' : 'grabbing';
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging && !isRotating) return;
    if (!isSelected) return;
    
    event.stopPropagation();
    
    if (isRotating) {
      // Handle rotation
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      
      // Rotate based on mouse movement
      const rotationSpeed = 0.02;
      const newRotation = [...furniture.rotation];
      newRotation[1] += mouse.x * rotationSpeed;
      
      onUpdate({ rotation: newRotation as [number, number, number] });
    } else if (isDragging) {
      // Handle position dragging
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
      const intersectPoint = new Vector3();
      
      if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
        const newPosition = intersectPoint.add(dragOffset);
        
        // Constrain to room bounds
        const roomWidth = 10;
        const roomLength = 10;
        const margin = Math.max(furniture.dimensions.width, furniture.dimensions.depth) / 2 + 0.2;
        
        newPosition.x = Math.max(-roomWidth/2 + margin, Math.min(roomWidth/2 - margin, newPosition.x));
        newPosition.z = Math.max(-roomLength/2 + margin, Math.min(roomLength/2 - margin, newPosition.z));
        newPosition.y = 0;

        onUpdate({
          position: [newPosition.x, newPosition.y, newPosition.z]
        });
      }
    }
  };

  const handlePointerUp = (event: any) => {
    if (isDragging || isRotating) {
      event.stopPropagation();
      setIsDragging(false);
      setIsRotating(false);
      
      // Remove dragging attribute using userData
      if (groupRef.current) {
        groupRef.current.userData.furnitureDragging = false;
      }
      
      document.dispatchEvent(new CustomEvent('furniture-drag-end'));
      gl.domElement.style.cursor = 'default';
    }
  };

  // Global event listeners for smooth dragging
  useFrame(() => {
    if ((isDragging || isRotating) && isSelected) {
      const handleGlobalPointerMove = (e: PointerEvent) => {
        const syntheticEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          stopPropagation: () => {}
        };
        handlePointerMove(syntheticEvent);
      };

      const handleGlobalPointerUp = () => {
        const syntheticEvent = {
          stopPropagation: () => {}
        };
        handlePointerUp(syntheticEvent);
        document.removeEventListener('pointermove', handleGlobalPointerMove);
        document.removeEventListener('pointerup', handleGlobalPointerUp);
      };

      document.addEventListener('pointermove', handleGlobalPointerMove);
      document.addEventListener('pointerup', handleGlobalPointerUp);
    }
  });

  const renderFurniture = () => {
    const { width, height, depth } = furniture.dimensions;
    const materialProps = getMaterialProps();

    switch (furniture.type) {
      // SEATING FURNITURE - More realistic designs
      case 'chair':
      case 'dining-chair':
        return (
          <group>
            {/* Seat */}
            <mesh position={[0, height * 0.45, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.85, height * 0.08, depth * 0.85]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Seat cushion */}
            <mesh position={[0, height * 0.52, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.8, height * 0.06, depth * 0.8]} />
              <meshStandardMaterial color="#F0F0F0" roughness={0.9} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, height * 0.75, -depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.8, height * 0.5, depth * 0.08]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Chair legs */}
            {[
              [-width * 0.35, height * 0.22, -depth * 0.35],
              [width * 0.35, height * 0.22, -depth * 0.35],
              [-width * 0.35, height * 0.22, depth * 0.35],
              [width * 0.35, height * 0.22, depth * 0.35],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <cylinderGeometry args={[0.025, 0.025, height * 0.44]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            ))}
          </group>
        );

      case 'office-chair':
        return (
          <group>
            {/* Chair base (5 wheels) */}
            <mesh position={[0, 0.05, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.4, width * 0.4, 0.1]} />
              <meshStandardMaterial color="#2D2D2D" metalness={0.7} />
            </mesh>
            {/* Wheels */}
            {Array.from({ length: 5 }, (_, i) => {
              const angle = (i / 5) * Math.PI * 2;
              const x = Math.cos(angle) * width * 0.35;
              const z = Math.sin(angle) * width * 0.35;
              return (
                <mesh key={i} position={[x, 0.03, z] as [number, number, number]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 0.06]} />
                  <meshStandardMaterial color="#1A1A1A" />
                </mesh>
              );
            })}
            {/* Gas cylinder */}
            <mesh position={[0, height * 0.3, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.04, 0.04, height * 0.5]} />
              <meshStandardMaterial color="#2D2D2D" metalness={0.8} />
            </mesh>
            {/* Seat */}
            <mesh position={[0, height * 0.55, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.35, width * 0.35, height * 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, height * 0.8, -depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.6, height * 0.4, depth * 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-width * 0.3, height * 0.7, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.05, depth * 0.4]} />
              <meshStandardMaterial color="#2D2D2D" />
            </mesh>
            <mesh position={[width * 0.3, height * 0.7, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.05, depth * 0.4]} />
              <meshStandardMaterial color="#2D2D2D" />
            </mesh>
          </group>
        );

      case 'loveseat':
      case '2-seat-sofa':
        return (
          <group>
            {/* Base frame */}
            <mesh position={[0, height * 0.25, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.3, depth]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Seat cushions */}
            <mesh position={[-width * 0.2, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.35, height * 0.15, depth * 0.7]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.2, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.35, height * 0.15, depth * 0.7]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Back cushions */}
            <mesh position={[-width * 0.2, height * 0.75, -depth * 0.3] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.3, height * 0.3, depth * 0.15]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.2, height * 0.75, -depth * 0.3] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.3, height * 0.3, depth * 0.15]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-width * 0.45, height * 0.6, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.4, depth * 0.8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.45, height * 0.6, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.4, depth * 0.8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );

      case 'l-shaped-sectional':
        return (
          <group>
            {/* Main long section */}
            <mesh position={[-width * 0.2, height * 0.4, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.6, height * 0.4, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* L-section extension */}
            <mesh position={[width * 0.2, height * 0.4, depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.4, height * 0.4, depth * 0.6]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Seat cushions - main section */}
            <mesh position={[-width * 0.35, height * 0.65, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.25, height * 0.1, depth * 0.7]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[-width * 0.05, height * 0.65, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.25, height * 0.1, depth * 0.7]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* L-section cushions */}
            <mesh position={[width * 0.2, height * 0.65, depth * 0.1] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.35, height * 0.1, depth * 0.25]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.2, height * 0.65, depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.35, height * 0.1, depth * 0.25]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Back cushions */}
            <mesh position={[-width * 0.2, height * 0.85, -depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.6, height * 0.3, depth * 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.35, height * 0.85, depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.3, depth * 0.6]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );

      case 'sofa':
      case '3-seat-sofa':
        return (
          <group>
            {/* Main seat cushions */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.9, height * 0.2, depth * 0.8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Sofa base/frame */}
            <mesh position={[0, height * 0.3, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.3, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Back cushions */}
            <mesh position={[0, height * 0.75, -depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.8, height * 0.4, depth * 0.2]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-width * 0.45, height * 0.65, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.4, depth * 0.8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.45, height * 0.65, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.4, depth * 0.8]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );

      // TABLES - Much more realistic with proper shapes
      case 'round-dining-table':
        return (
          <group>
            {/* Round table top */}
            <mesh position={[0, height - 0.05, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.5, width * 0.5, 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Center pedestal base */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.15, width * 0.25, height - 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Plates on table */}
            {Array.from({ length: 4 }, (_, i) => {
              const angle = (i / 4) * Math.PI * 2;
              const plateX = Math.cos(angle) * width * 0.25;
              const plateZ = Math.sin(angle) * width * 0.25;
              return (
                <mesh key={i} position={[plateX, height + 0.01, plateZ] as [number, number, number]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.12, 0.12, 0.02]} />
                  <meshStandardMaterial color="#F5F5F5" />
                </mesh>
              );
            })}
          </group>
        );

      case 'oval-dining-table':
        return (
          <group>
            {/* Oval table top (using scaled cylinder) */}
            <mesh position={[0, height - 0.05, 0] as [number, number, number]} scale={[width/depth, 1, 1]} castShadow receiveShadow>
              <cylinderGeometry args={[depth * 0.5, depth * 0.5, 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Two pedestal legs */}
            <mesh position={[-width * 0.25, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.2, height - 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.25, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.2, height - 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Plates arranged in oval pattern */}
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const plateX = Math.cos(angle) * width * 0.3;
              const plateZ = Math.sin(angle) * depth * 0.25;
              return (
                <mesh key={i} position={[plateX, height + 0.01, plateZ] as [number, number, number]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.11, 0.11, 0.02]} />
                  <meshStandardMaterial color="#F5F5F5" />
                </mesh>
              );
            })}
          </group>
        );

      case 'extendable-dining-table':
        return (
          <group>
            {/* Main table section */}
            <mesh position={[0, height - 0.05, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.7, 0.1, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Extension sections */}
            <mesh position={[-width * 0.4, height - 0.05, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.2, 0.1, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[width * 0.4, height - 0.05, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.2, 0.1, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Table legs */}
            {[
              [-width * 0.3, height * 0.5, -depth * 0.4],
              [width * 0.3, height * 0.5, -depth * 0.4],
              [-width * 0.3, height * 0.5, depth * 0.4],
              [width * 0.3, height * 0.5, depth * 0.4],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <boxGeometry args={[0.08, height - 0.1, 0.08]} />
                <meshStandardMaterial {...materialProps} />
              </mesh>
            ))}
            {/* Plates */}
            {Array.from({ length: 8 }, (_, i) => {
              const x = -width * 0.35 + (i % 4) * (width * 0.7 / 3);
              const z = i < 4 ? -depth * 0.3 : depth * 0.3;
              return (
                <mesh key={i} position={[x, height + 0.01, z] as [number, number, number]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.1, 0.1, 0.02]} />
                  <meshStandardMaterial color="#F5F5F5" />
                </mesh>
              );
            })}
          </group>
        );

      case 'coffee-table':
        return (
          <group>
            {/* Table top with realistic thickness */}
            <mesh position={[0, height - 0.04, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.08, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Table legs with proper proportions */}
            {[
              [-width * 0.4, height * 0.5, -depth * 0.4],
              [width * 0.4, height * 0.5, -depth * 0.4],
              [-width * 0.4, height * 0.5, depth * 0.4],
              [width * 0.4, height * 0.5, depth * 0.4],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.04, height - 0.08]} />
                <meshStandardMaterial {...materialProps} />
              </mesh>
            ))}
            {/* Coffee cups and magazines */}
            <mesh position={[width * 0.2, height + 0.05, depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.08]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[-width * 0.15, height + 0.02, -depth * 0.1] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[0.2, 0.02, 0.28]} />
              <meshStandardMaterial color="#FF6B6B" />
            </mesh>
          </group>
        );

      case 'side-table':
      case 'nightstand':
        return (
          <group>
            {/* Table top */}
            <mesh position={[0, height - 0.03, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.06, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Drawer */}
            <mesh position={[0, height * 0.7, depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.9, height * 0.25, depth * 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Drawer handle */}
            <mesh position={[0, height * 0.7, depth * 0.45] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.08]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
            </mesh>
            {/* Table legs */}
            {[
              [-width * 0.4, height * 0.35, -depth * 0.4],
              [width * 0.4, height * 0.35, -depth * 0.4],
              [-width * 0.4, height * 0.35, depth * 0.4],
              [width * 0.4, height * 0.35, depth * 0.4],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <boxGeometry args={[0.06, height * 0.7, 0.06]} />
                <meshStandardMaterial {...materialProps} />
              </mesh>
            ))}
            {/* Table lamp */}
            <mesh position={[width * 0.2, height + 0.1, depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.05, 0.15]} />
              <meshStandardMaterial color="#2D1810" />
            </mesh>
            <mesh position={[width * 0.2, height + 0.25, depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <coneGeometry args={[0.08, 0.12, 8]} />
              <meshStandardMaterial color="#F5E6D3" />
            </mesh>
          </group>
        );

      // BED - Much more realistic
      case 'bed':
        return (
          <group>
            {/* Bed frame base */}
            <mesh position={[0, height * 0.3, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.1, height * 0.2, depth + 0.1]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Mattress */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.2, depth]} />
              <meshStandardMaterial color="#F5F5DC" roughness={0.8} />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, height * 0.9, -depth * 0.55] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.8, 0.1]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Pillows */}
            <mesh position={[-width * 0.25, height * 0.65, -depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.35, height * 0.15, depth * 0.25]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
            <mesh position={[width * 0.25, height * 0.65, -depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.35, height * 0.15, depth * 0.25]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
            {/* Blanket */}
            <mesh position={[0, height * 0.62, depth * 0.1] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.9, height * 0.08, depth * 0.6]} />
              <meshStandardMaterial color="#4A90E2" roughness={0.8} />
            </mesh>
          </group>
        );

      // KITCHEN APPLIANCES - Much more detailed
      case 'refrigerator':
        return (
          <group>
            {/* Main body */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color="#E8E8E8" metalness={0.3} roughness={0.1} />
            </mesh>
            {/* Freezer door (top) */}
            <mesh position={[width * 0.45, height * 0.75, depth * 0.01] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.45, 0.02]} />
              <meshStandardMaterial color="#D0D0D0" />
            </mesh>
            {/* Main door (bottom) */}
            <mesh position={[width * 0.45, height * 0.25, depth * 0.01] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.1, height * 0.45, 0.02]} />
              <meshStandardMaterial color="#D0D0D0" />
            </mesh>
            {/* Handles */}
            <mesh position={[width * 0.4, height * 0.8, depth * 0.02] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[0.15, 0.05, 0.02]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
            </mesh>
            <mesh position={[width * 0.4, height * 0.3, depth * 0.02] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[0.15, 0.05, 0.02]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
            </mesh>
          </group>
        );

      case 'stove':
      case 'oven':
        return (
          <group>
            {/* Main body */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color="#2F2F2F" metalness={0.7} />
            </mesh>
            {/* Cooktop surface */}
            <mesh position={[0, height + 0.01, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.95, 0.02, depth * 0.95]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            {/* Burners */}
            {[
              [-width * 0.25, height + 0.02, -depth * 0.25],
              [width * 0.25, height + 0.02, -depth * 0.25],
              [-width * 0.25, height + 0.02, depth * 0.25],
              [width * 0.25, height + 0.02, depth * 0.25],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.02]} />
                <meshStandardMaterial color="#0a0a0a" />
              </mesh>
            ))}
            {/* Oven door */}
            <mesh position={[0, height * 0.3, depth * 0.45] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.8, height * 0.4, 0.05]} />
              <meshStandardMaterial color="#1F1F1F" />
            </mesh>
            {/* Oven handle */}
            <mesh position={[0, height * 0.5, depth * 0.48] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.02, 0.02, width * 0.6]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
            </mesh>
          </group>
        );

      // BATHROOM FIXTURES - Much more realistic
      case 'bathtub':
        return (
          <group>
            {/* Tub basin */}
            <mesh position={[0, height * 0.3, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height * 0.4, depth]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Inner basin */}
            <mesh position={[0, height * 0.4, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.9, height * 0.3, depth * 0.9]} />
              <meshStandardMaterial color="#F8F8FF" />
            </mesh>
            {/* Tub rim */}
            <mesh position={[0, height * 0.6, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.1, height * 0.05, depth + 0.1]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Faucet */}
            <mesh position={[0, height * 0.7, -depth * 0.4] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.15]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
            </mesh>
            {/* Water level */}
            <mesh position={[0, height * 0.45, 0] as [number, number, number]} receiveShadow>
              <boxGeometry args={[width * 0.85, 0.01, depth * 0.85]} />
              <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
            </mesh>
          </group>
        );

      case 'toilet':
        return (
          <group>
            {/* Toilet base/bowl */}
            <mesh position={[0, height * 0.2, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.35, width * 0.4, height * 0.4]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Toilet seat */}
            <mesh position={[0, height * 0.42, 0] as [number, number, number]} castShadow receiveShadow>
              <torusGeometry args={[width * 0.3, width * 0.05]} />
              <meshStandardMaterial color="#F5F5F5" />
            </mesh>
            {/* Toilet tank */}
            <mesh position={[0, height * 0.7, -depth * 0.25] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.6, height * 0.4, depth * 0.25]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Tank lid */}
            <mesh position={[0, height * 0.92, -depth * 0.25] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.58, height * 0.04, depth * 0.23]} />
              <meshStandardMaterial color="#F8F8F8" />
            </mesh>
            {/* Flush handle */}
            <mesh position={[-width * 0.25, height * 0.8, -depth * 0.35] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[0.05, 0.08, 0.02]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
            </mesh>
          </group>
        );

      case 'sink':
        return (
          <group>
            {/* Sink basin */}
            <mesh position={[0, height * 0.15, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.4, width * 0.4, height * 0.25]} />
              <meshStandardMaterial color="#E8E8E8" metalness={0.8} />
            </mesh>
            {/* Inner basin */}
            <mesh position={[0, height * 0.2, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.35, width * 0.35, height * 0.15]} />
              <meshStandardMaterial color="#F0F0F0" metalness={0.7} />
            </mesh>
            {/* Faucet base */}
            <mesh position={[0, height * 0.4, -depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.1]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
            </mesh>
            {/* Faucet spout */}
            <mesh position={[0, height * 0.55, 0] as [number, number, number]} castShadow receiveShadow>
              <torusGeometry args={[0.15, 0.02]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} />
            </mesh>
            {/* Hot/cold handles */}
            <mesh position={[-0.1, height * 0.5, -depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.06]} />
              <meshStandardMaterial color="#FF4444" />
            </mesh>
            <mesh position={[0.1, height * 0.5, -depth * 0.2] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.06]} />
              <meshStandardMaterial color="#4444FF" />
            </mesh>
          </group>
        );

      // STORAGE - More detailed
      case 'bookshelf':
        return (
          <group>
            {/* Main frame */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Shelves */}
            {Array.from({ length: Math.floor(height / 0.4) + 1 }, (_, i) => (
              <mesh key={i} position={[0, i * 0.4 + 0.1, depth * 0.4] as [number, number, number]} castShadow receiveShadow>
                <boxGeometry args={[width * 0.95, 0.03, depth * 0.8]} />
                <meshStandardMaterial {...materialProps} />
              </mesh>
            ))}
            {/* Books */}
            {Array.from({ length: Math.floor(height / 0.4) }, (_, shelfIndex) =>
              Array.from({ length: 8 }, (_, bookIndex) => (
                <mesh 
                  key={`${shelfIndex}-${bookIndex}`} 
                  position={[
                    -width * 0.4 + bookIndex * (width * 0.8 / 7), 
                    shelfIndex * 0.4 + 0.25, 
                    depth * 0.3
                  ] as [number, number, number]} 
                  castShadow receiveShadow
                >
                  <boxGeometry args={[0.03, 0.25, 0.18]} />
                  <meshStandardMaterial color={`hsl(${bookIndex * 45}, 70%, 50%)`} />
                </mesh>
              ))
            )}
          </group>
        );

      case 'wardrobe':
        return (
          <group>
            {/* Main cabinet body */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Left door */}
            <mesh position={[-width * 0.25, height * 0.5, depth * 0.48] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.45, height * 0.9, 0.04]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Right door */}
            <mesh position={[width * 0.25, height * 0.5, depth * 0.48] as [number, number, number]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.45, height * 0.9, 0.04]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Door handles */}
            <mesh position={[-width * 0.15, height * 0.6, depth * 0.52] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.08]} />
              <meshStandardMaterial color="#B8860B" metalness={0.8} />
            </mesh>
            <mesh position={[width * 0.15, height * 0.6, depth * 0.52] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.08]} />
              <meshStandardMaterial color="#B8860B" metalness={0.8} />
            </mesh>
            {/* Hanging rod */}
            <mesh position={[0, height * 0.8, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.015, 0.015, width * 0.8]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
            </mesh>
            {/* Hanging clothes */}
            {Array.from({ length: 5 }, (_, i) => (
              <mesh 
                key={i} 
                position={[-width * 0.3 + i * (width * 0.6 / 4), height * 0.6, 0] as [number, number, number]} 
                castShadow receiveShadow
              >
                <boxGeometry args={[0.03, 0.3, 0.15]} />
                <meshStandardMaterial color={`hsl(${i * 72}, 60%, 50%)`} />
              </mesh>
            ))}
          </group>
        );

      // LAMPS - Much more detailed
      case 'floor-lamp':
        return (
          <group>
            {/* Base */}
            <mesh position={[0, height * 0.05, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.3, width * 0.4, height * 0.1]} />
              <meshStandardMaterial color="#2D1810" metalness={0.3} />
            </mesh>
            {/* Pole */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.02, 0.02, height * 0.8]} />
              <meshStandardMaterial color="#4A4A4A" metalness={0.8} />
            </mesh>
            {/* Lamp shade */}
            <mesh position={[0, height * 0.85, 0] as [number, number, number]} castShadow receiveShadow>
              <coneGeometry args={[width * 0.4, height * 0.25, 12]} />
              <meshStandardMaterial color="#F5E6D3" />
            </mesh>
            {/* Light bulb glow */}
            <pointLight 
              position={[0, height * 0.8, 0]} 
              intensity={0.5} 
              distance={4} 
              color="#FFEEAA" 
            />
            {/* Pull chain */}
            <mesh position={[width * 0.2, height * 0.75, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.005, 0.005, 0.15]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
          </group>
        );

      case 'table-lamp':
        return (
          <group>
            {/* Base */}
            <mesh position={[0, height * 0.15, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.25, width * 0.3, height * 0.3]} />
              <meshStandardMaterial color="#2D1810" metalness={0.3} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
              <cylinderGeometry args={[0.015, 0.015, height * 0.4]} />
              <meshStandardMaterial color="#4A4A4A" metalness={0.8} />
            </mesh>
            {/* Shade */}
            <mesh position={[0, height * 0.8, 0] as [number, number, number]} castShadow receiveShadow>
              <coneGeometry args={[width * 0.3, height * 0.2, 10]} />
              <meshStandardMaterial color="#F5E6D3" />
            </mesh>
            {/* Light */}
            <pointLight 
              position={[0, height * 0.75, 0]} 
              intensity={0.3} 
              distance={2} 
              color="#FFEEAA" 
            />
          </group>
        );

      // DEFAULT CASE FOR UNDEFINED FURNITURE TYPE
      default:
        return (
          <mesh position={[0, height * 0.5, 0] as [number, number, number]} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={furniture.position as [number, number, number]}
      rotation={furniture.rotation as [number, number, number]}
      scale={furniture.scale as [number, number, number]}
      onPointerDown={handlePointerDown}
      onPointerMove={(isDragging || isRotating) ? handlePointerMove : undefined}
      onPointerUp={handlePointerUp}
      onPointerOver={() => {
        if (!isDragging && !isRotating) {
          gl.domElement.style.cursor = isSelected ? 'grab' : 'pointer';
        }
      }}
      onPointerOut={() => {
        if (!isDragging && !isRotating) {
          gl.domElement.style.cursor = 'default';
        }
      }}
    >
      {renderFurniture()}
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.01, 0] as [number, number, number]} rotation={[-Math.PI / 2, 0, 0] as [number, number, number]}>
          <ringGeometry args={[Math.max(furniture.dimensions.width, furniture.dimensions.depth) * 0.6, Math.max(furniture.dimensions.width, furniture.dimensions.depth) * 0.7]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Rotation indicator */}
      {isSelected && (
        <mesh position={[0, furniture.dimensions.height + 0.3, 0] as [number, number, number]}>
          <ringGeometry args={[0.2, 0.25]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.7} />
        </mesh>
      )}
      
      {/* Drag indicator */}
      {isDragging && (
        <mesh position={[0, furniture.dimensions.height + 0.5, 0] as [number, number, number]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
        </mesh>
      )}
      
      {/* Rotation indicator */}
      {isRotating && (
        <mesh position={[0, furniture.dimensions.height + 0.5, 0] as [number, number, number]}>
          <torusGeometry args={[0.15, 0.02]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

export default FurnitureItem;
