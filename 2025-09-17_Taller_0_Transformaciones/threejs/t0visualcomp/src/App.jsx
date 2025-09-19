import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useRef } from "react";

function ReferenceGround() {

  //Behind Cube for reference.
  return (
    <mesh position = {[0, 0, -4]}
      receiveShadow>
      <planeGeometry args = {[40, 40]}/>
      <meshStandardMaterial color = "red"/>
    </mesh>
  )
}

function CubeTRSTransformation() {
  //React hook
  const mesh_obj = useRef();

  //Cube Initial Coordinates
  const InitialPos = [-15, 0, 0];

  useFrame((state, delta) => {
    if (mesh_obj.current) {

      //Sine curve parameters
      const WAmp = 1.5;
      const Freq = 4;
      

      //Cur time
      const t = state.clock.getElapsedTime()

      //Smooth Scale factor (Avoids negative size)
      const SmoothScale = 2 + (WAmp / 5) * Math.sin(t)
      
      //Translation (Sinusoidal trajectory). Movement along X to notice sinusoidal

      mesh_obj.current.position.x = InitialPos[0] + 0.7 * t
      mesh_obj.current.position.y = InitialPos[1] + WAmp * Math.sin(t * Freq)
      mesh_obj.current.position.z = 0

      //Axis rotation
      mesh_obj.current.rotation.x += 0.7 * delta;
      mesh_obj.current.rotation.y += 0.7 * delta;
      mesh_obj.current.rotation.z += 0.7 * delta;

      //Smooth Scale

      mesh_obj.current.scale.set(SmoothScale, SmoothScale, SmoothScale)
    }

  })

  //Cube geometry
  return (
    <mesh ref={mesh_obj}
      castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  )

}


export default function App() {
  return (
    <Canvas 
    camera = {{position: [0, 3, 8]}}
    shadows>

      <OrbitControls enableRotate 
        enablePan 
        enableZoom />

      //Overall light. Smooth scene.
      <ambientLight intensity = {0.5}/>

      <directionalLight position={[5, 5, 10]} 
        intensity={1} 
        //Enables shadows casting by directional light
        castShadow
        //Increase frustum of directional light camera
        shadow-camera-top = {50}
        shadow-camera-bottom = {-50}
        shadow-camera-left = {-50}
        shadow-camera-right = {50}
        //Shadow quality (Increases frustum -> blurry shadows (lq))
        shadow-mapSize-width = {1024}
        shadow-mapSize-height = {1024}/>

      //Geometry rendering
      <ReferenceGround />
      <CubeTRSTransformation />
  
    </Canvas>
  );
}
