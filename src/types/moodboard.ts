
// Types for moodboard elements
export interface ImageElement {
  id: string;
  type: 'image';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  isDragging: boolean;
  zIndex: number;
}

export interface TextElement {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  isDragging: boolean;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface ColorSwatchElement {
  id: string;
  type: 'color';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  isDragging: boolean;
  rotation: number;
  zIndex: number;
}

export type MoodboardElement = ImageElement | TextElement | ColorSwatchElement;
