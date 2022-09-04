export interface Gradient {
  id: number;
  angle: number;
  values: (number | string)[];
  cssString: string;
}

export interface GradientConfig {
  id: number;
  cssString: string;
  values: (string | number)[];
  startIndex: { x: number; y: number };
  endIndex: { x: number; y: number };
}

export interface ClipConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export interface Token {
  content: string;
  color: string;
  lineNumber: number;
}

export interface ComputedToken extends Token {
  x: number;
  y: number;
  width: number;
  startFromIndex: number;
}

export interface TokenRenderState {
  tokens: ComputedToken[];
  index: number;
}

export interface Position {
  prevIndex: number;
  currentIndex: number;
}

export type Device = {
  label: string;
  id: string;
};

export type State = 'ready' | 'recording' | 'stopRecording' |'preview'