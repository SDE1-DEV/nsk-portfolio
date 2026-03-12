/// <reference types="vite/client" />

// Fix R3F material type issues
declare namespace JSX {
  interface IntrinsicElements {
    meshStandardMaterial: any;
    pointsMaterial: any;
  }
}
