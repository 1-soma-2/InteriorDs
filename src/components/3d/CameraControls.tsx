
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface CameraControlsProps {
  enabled?: boolean;
  autoRotate?: boolean;
  minDistance?: number;
  maxDistance?: number;
  target?: [number, number, number];
}

const CameraControls = ({ 
  enabled = true, 
  autoRotate = false,
  minDistance = 5,
  maxDistance = 30,
  target = [0, 0, 0]
}: CameraControlsProps) => {
  const controlsRef = useRef<any>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    if (controlsRef.current) {
      // Set initial camera position only once
      camera.position.set(12, 10, 12);
      camera.lookAt(...target);
      controlsRef.current.update();
      
      // Add data attribute for furniture dragging detection
      if (gl.domElement.parentElement) {
        gl.domElement.parentElement.setAttribute('data-camera-controls', 'true');
        (gl.domElement.parentElement as any).controls = controlsRef.current;
      }
    }
  }, [camera]);

  // Handle target changes without resetting camera position
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [target]);

  // Global event listeners to handle furniture dragging
  useEffect(() => {
    let isDraggingFurniture = false;

    const handlePointerDown = (event: PointerEvent) => {
      // Check if we're clicking on furniture
      const target = event.target as HTMLElement;
      if (target && target.closest('canvas')) {
        // Check if any furniture is being dragged by looking for userData
        const furnitureElements = document.querySelectorAll('canvas');
        furnitureElements.forEach(canvas => {
          const scene = (canvas as any).__r3f?.scene;
          if (scene) {
            scene.traverse((child: any) => {
              if (child.userData && child.userData.furnitureDragging) {
                isDraggingFurniture = true;
              }
            });
          }
        });
      }
    };

    const handlePointerUp = () => {
      isDraggingFurniture = false;
      if (controlsRef.current) {
        controlsRef.current.enabled = enabled;
      }
    };

    const handlePointerMove = () => {
      if (isDraggingFurniture && controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    };

    // Listen for custom events from furniture items
    const handleFurnitureDragStart = () => {
      isDraggingFurniture = true;
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    };

    const handleFurnitureDragEnd = () => {
      isDraggingFurniture = false;
      if (controlsRef.current) {
        controlsRef.current.enabled = enabled;
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('furniture-drag-start', handleFurnitureDragStart);
    document.addEventListener('furniture-drag-end', handleFurnitureDragEnd);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('furniture-drag-start', handleFurnitureDragStart);
      document.removeEventListener('furniture-drag-end', handleFurnitureDragEnd);
    };
  }, [enabled]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enabled={enabled}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={0.3}
      target={target}
      dampingFactor={0.1}
      enableDamping={true}
      rotateSpeed={0.8}
      zoomSpeed={0.8}
      panSpeed={0.8}
      screenSpacePanning={true}
      mouseButtons={{
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2
      }}
      touches={{
        ONE: 0,
        TWO: 2
      }}
      makeDefault={true}
    />
  );
};

export default CameraControls;
