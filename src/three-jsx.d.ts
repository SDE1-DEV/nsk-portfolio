import { extend, Object3DNode, MaterialNode } from "@react-three/fiber";
import * as THREE from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    pointsMaterial: MaterialNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
  }
}
