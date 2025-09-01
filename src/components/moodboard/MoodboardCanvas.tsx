import { useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';
import { MoodboardElement, ImageElement, TextElement, ColorSwatchElement } from '../../types/moodboard';

// Types
interface MoodboardCanvasProps {
  elements: MoodboardElement[];
  setElements: React.Dispatch<React.SetStateAction<MoodboardElement[]>>;
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  stageWidth: number;
  stageHeight: number;
}

// Image component for Konva
const URLImage = ({ element, isSelected, onSelect, onChange }: { 
  element: ImageElement, 
  isSelected: boolean,
  onSelect: () => void,
  onChange: (updatedElement: ImageElement) => void
}) => {
  const [image] = useImage(element.src);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = () => {
    onChange({
      ...element,
      isDragging: true,
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...element,
      isDragging: false,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransform = () => {
    if (!shapeRef.current) return;
    
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale to avoid accumulation
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
        opacity={element.isDragging ? 0.5 : 1}
        perfectDrawEnabled={false}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit size
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Text component for Konva
const TextNode = ({ element, isSelected, onSelect, onChange }: {
  element: TextElement,
  isSelected: boolean,
  onSelect: () => void,
  onChange: (updatedElement: TextElement) => void
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = () => {
    onChange({
      ...element,
      isDragging: true,
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...element,
      isDragging: false,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransform = () => {
    if (!shapeRef.current) return;
    
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    
    // Reset scale to avoid accumulation
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      // Update font size based on scale
      fontSize: element.fontSize * scaleX,
      width: Math.max(10, node.width()),
      height: Math.max(10, node.height()),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <Text
        ref={shapeRef}
        text={element.text}
        x={element.x}
        y={element.y}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        fill={element.fill}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
        opacity={element.isDragging ? 0.5 : 1}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['middle-left', 'middle-right']}
        />
      )}
    </>
  );
};

// Color swatch component for Konva
const ColorSwatch = ({ element, isSelected, onSelect, onChange }: {
  element: ColorSwatchElement,
  isSelected: boolean,
  onSelect: () => void,
  onChange: (updatedElement: ColorSwatchElement) => void
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = () => {
    onChange({
      ...element,
      isDragging: true,
    });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...element,
      isDragging: false,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransform = () => {
    if (!shapeRef.current) return;
    
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale to avoid accumulation
    node.scaleX(1);
    node.scaleY(1);
    
    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: Math.max(10, node.width() * scaleX),
      height: Math.max(10, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <Rect
        ref={shapeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill={element.fill}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
        opacity={element.isDragging ? 0.5 : 1}
        rotation={element.rotation}
        cornerRadius={4}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit size
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Main Canvas Component
const MoodboardCanvas = ({ 
  elements, 
  setElements, 
  selectedId, 
  setSelectedId,
  stageWidth,
  stageHeight
}: MoodboardCanvasProps) => {
  
  const handleElementChange = (updatedElement: MoodboardElement) => {
    setElements(
      elements.map(el => (el.id === updatedElement.id ? updatedElement : el))
    );
  };

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      className="bg-white rounded-lg shadow-md border border-neutral-200"
    >
      <Layer>
        {/* Background grid or pattern could be added here */}
        
        {/* Sort elements by zIndex to handle proper layering */}
        {[...elements].sort((a, b) => a.zIndex - b.zIndex).map(element => {
          const isSelected = element.id === selectedId;
          
          if (element.type === 'image') {
            return (
              <URLImage
                key={element.id}
                element={element as ImageElement}
                isSelected={isSelected}
                onSelect={() => setSelectedId(element.id)}
                onChange={(updatedElement) => handleElementChange(updatedElement)}
              />
            );
          } else if (element.type === 'text') {
            return (
              <TextNode
                key={element.id}
                element={element as TextElement}
                isSelected={isSelected}
                onSelect={() => setSelectedId(element.id)}
                onChange={(updatedElement) => handleElementChange(updatedElement)}
              />
            );
          } else if (element.type === 'color') {
            return (
              <ColorSwatch
                key={element.id}
                element={element as ColorSwatchElement}
                isSelected={isSelected}
                onSelect={() => setSelectedId(element.id)}
                onChange={(updatedElement) => handleElementChange(updatedElement)}
              />
            );
          }
          
          return null;
        })}
      </Layer>
    </Stage>
  );
};

export default MoodboardCanvas;
