import { Suspense, useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useAnimations, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

//-------------------------------- PRESETS ---------------------------------------//

//TEXTURES

const GROUND_TEXTURE = {
  map: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_Color.jpg",   
  normal: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_NormalGL.jpg", 
  roughness: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_Roughness.jpg",
  ao: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_AmbientOcclusion.jpg", 
}; 

const CUBE_TEXTURE = {
  map: "/textures/PavingStones138_1K-JPG/PavingStones138_1K-JPG_Color.jpg",   
  normal: "/textures/PavingStones138_1K-JPG/PavingStones138_1K-JPG_NormalGL.jpg", 
  roughness: "/textures/Bricks097_1K-JPG/PavingStones138_1K-JPG_Roughness.jpg",
  ao: "/textures/Bricks097_1K-JPG/PavingStones138_1K-JPG_AmbientOcclusion.jpg",
};

const SPHERE_TEXTURE = {
  map: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_Color.jpg",   
  normal: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_NormalGL.jpg", 
  roughness: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_Roughness.jpg",
  metalness: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_Metalness.jpg",
};

//CAM CONFIG
const SCENE_CAMS = [

    { 
        name: "Perspective", 
        position: [20, 20, 20], 
        fov: 75, 
    },

    { 
        name: "Orthographic", 
        position: [0, 20, -50],
        zoom: 5,
    },

];

// GLB Objects
//Main Object. Spartan
const mainObjPath = "/glb_models/spartan_armour_mkv_-_halo_reach.glb";

//Prop Object
const propObjPath = "/glb_models/combat_robot.glb";

//Environment Object
const envObjPath = "/glb_models/ussr_launch_site.glb";


function Ground () {

  const meshRef = useRef();
  const textures = useTexture(GROUND_TEXTURE);

  const tiling = 50;

  Object.values(textures).forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(tiling, tiling); 

        if (texture !== textures.map) {
            texture.encoding = THREE.LinearEncoding;
        }
    });
    
    useLayoutEffect(() => {

      if (meshRef.current && meshRef.current.geometry && meshRef.current.geometry.attributes.uv) {
         const geometry = meshRef.current.geometry;
        geometry.setAttribute(
          'uv2', 
          new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
        );
      }
    }, []);

  return (
    //Default on X - Y. -PI/2 X - Z Plane. Receives shadows from objs
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >

      <planeGeometry args={[1500, 1500]} />
      <meshStandardMaterial 
        {...textures}
        metalness = {0.01}
        roughness = {0.8}
        aoMapIntensity = {1.0}
      />
    </mesh>

  );
}

function EnvObject() {

  const groupRef = useRef();

  const { scene, animations } = useGLTF(envObjPath);
  const { actions } = useAnimations(animations, groupRef);

  //Animation
  useEffect ( ()=> {
    const action = Object.values(actions)[0];
    if (action) {
      action.loop = THREE.LoopRepeat;
      action.play();
    }

    return () => {
      if (action) {
        action.stop();
      }
    }
  }, [actions]);


  useEffect( () => {

    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);

    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {

          child.material = child.material.clone();
          const mat = child.material;

          ['map', 'lightMap', 'aoMap', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach(prop => {
            if (mat[prop]) {
              mat[prop].encoding = THREE.sRGBEncoding;
              mat[prop].needsUpdate = true;
            }
          });

          if (mat.color) {
            mat.color.convertSRGBToLinear();
          }

          mat.side = THREE.DoubleSide; 
          mat.needsUpdate = true; 
          mat.vertexColors = mat.vertexColors;
                  
           /*
          if (child.material.emissive) {
            child.material.emissive.setHex(0x000000); 
          }
          */

          child.castShadow = true;
          child.receiveShadow = true;
        }

        if (child.geometry) {
          child.geometry.computeVertexNormals();
        }

      }

    });
  }, [scene]);

  return (
    <primitive
      ref = {groupRef}
      object = {scene.clone()}
      scale = {3.5}
      position = {[0, 10, 0]}
      castShadow
    />
  );
}

function PropObject() {

  const groupRef = useRef();

  const { scene, animations } = useGLTF(propObjPath);
  const { actions } = useAnimations(animations, groupRef);

  //Animation
  useEffect ( ()=> {
    const action = Object.values(actions)[0];
    if (action) {
      action.loop = THREE.LoopRepeat;
      action.play();
    }

    return () => {
      if (action) {
        action.stop();
      }
    }
  }, [actions]);


  useEffect( () => {

    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);

    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {

          child.material = child.material.clone();
          const mat = child.material;

          ['map', 'lightMap', 'aoMap', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach(prop => {
            if (mat[prop]) {
              mat[prop].encoding = THREE.sRGBEncoding;
              mat[prop].needsUpdate = true;
            }
          });

          if (mat.color) {
            mat.color.convertSRGBToLinear();
          }

          mat.side = THREE.DoubleSide; 
          mat.needsUpdate = true; 
          mat.vertexColors = mat.vertexColors;
                  
           /*
          if (child.material.emissive) {
            child.material.emissive.setHex(0x000000); 
          }
          */

          child.castShadow = true;
          child.receiveShadow = true;
        }

        if (child.geometry) {
          child.geometry.computeVertexNormals();
        }

      }

    });
  }, [scene]);

  return (
    <primitive
      ref = {groupRef}
      object = {scene.clone()}
      scale = {3.0}
      position = {[20, 25, 40]}
      castShadow
    />
  );
}

function MainObject() {

  const groupRef = useRef();

  const { scene, animations } = useGLTF(mainObjPath);
  const { actions } = useAnimations(animations, groupRef);

  //Animation
  useEffect ( ()=> {
    const action = Object.values(actions)[0];
    if (action) {
      action.loop = THREE.LoopRepeat;
      action.play();
    }

    return () => {
      if (action) {
        action.stop();
      }
    }
  }, [actions]);


  useEffect( () => {

    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);

    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {

          child.material = child.material.clone();
          const mat = child.material;

          ['map', 'lightMap', 'aoMap', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach(prop => {
            if (mat[prop]) {
              mat[prop].encoding = THREE.sRGBEncoding;
              mat[prop].needsUpdate = true;
            }
          });

          if (mat.color) {
            mat.color.convertSRGBToLinear();
          }

          mat.side = THREE.DoubleSide; 
          mat.needsUpdate = true; 
          mat.vertexColors = mat.vertexColors;
                  
           /*
          if (child.material.emissive) {
            child.material.emissive.setHex(0x000000); 
          }
          */

          child.castShadow = true;
          child.receiveShadow = true;
        }

        if (child.geometry) {
          child.geometry.computeVertexNormals();
        }

      }

    });
  }, [scene]);

  return (
    <primitive
      ref = {groupRef}
      object = {scene.clone()}
      scale = {0.6}
      position = {[-40, 30, 0]}
      castShadow
    />
  );
}


function CamHandler({ cams }) {

  const perspectiveCamRef = useRef();
  const orthoCamRef = useRef();

  const curCams = [
    {...cams[0], ref: perspectiveCamRef},
    {...cams[1], ref: orthoCamRef},
  ];

  const {set, camera: activeSceneCam } = useThree();
  const [activeCamIdx, setActiveCamIdx] = useState(0);

  const switchCam = useCallback(() => {
    setActiveCamIdx((prevCamIdx) => (prevCamIdx + 1) % curCams.length);
  }, [curCams.length]);

  //Keyboard binding
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'c' || event.key === 'C') {
        switchCam();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [switchCam]);

  // Set Active Cam as Main Scene Cam
  useEffect(() => {
    const nextCam = curCams[activeCamIdx].ref.current;
    if (nextCam && nextCam !== activeSceneCam) {
        set({ camera: nextCam });
        
        //Orthographic edge case handling
        if (curCams[activeCamIdx].name === "Orthographic") {
            nextCam.updateProjectionMatrix();
        }
    }
  }, [activeCamIdx, curCams, set, activeSceneCam]);

  const curCamHandle = curCams[activeCamIdx].ref.current;

  return (
    <>

      <perspectiveCamera
        ref = {perspectiveCamRef}
        position = {cams[0].position}
        fov = {cams[0].fov}
        near = {0.01}
      />

      <orthographicCamera
        ref = {orthoCamRef}
        position = {cams[1].position}
        zoom = {cams[1].zoom}
        near = {0.01}
      />
      
      <OrbitControls 
        camera = {curCamHandle}
        enabled = {curCamHandle === activeSceneCam}  
        enablePan = {true}
      />

    </>
  );

}


function Scene () {

  return (
    <>

      <ambientLight
        intensity = {0.2}
      />

      {/*KEY LIGHT. i.e. HIGH INTENSITY. Enhances shadows.*/} 
      <directionalLight 
        position = {[50, 10, 50]} 
        intensity = {10} 
        color = {"#FFFFFF"} 
        castShadow

        //Light Frustum
        shadow-camera-near = {1} 
        shadow-camera-far = {200} 
        shadow-camera-left = {-60}  
        shadow-camera-right = {60} 
        shadow-camera-top = {60} 
        shadow-camera-bottom = {-60} 

        //ShadowMap res
        shadow-mapSize-width = {2048}
        shadow-mapSize-height = {2048}

        shadow-bias = {-0.0005}
      />

      {/*FILL LIGHT. i.e. LOW INTENSITY. Softens.*/} 
      <directionalLight 
        position = {[2, 4, 7]} 
        intensity = {0} 
        color = {"#ADD8E6"} 
      />

      {/*RIM LIGHT. Object specific. Edges enhancing.*/} 
      <pointLight 
        position = {[0, 0, -2]} 
        intensity = {0} 
        color = {"#FFFDD0"} 
        />

      <Ground />
      <EnvObject />
      <MainObject />
      <PropObject />

      <CamHandler cams = {SCENE_CAMS} />
    </>
  );

}

export default function App () {
    return (
    <Canvas 
      shadows
      gl={{
        
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap, 
        },
        
        outputEncoding: THREE.LinearEncoding,
      }}
    >
      <Suspense fallback = {null}>
        <Scene />
      </Suspense>

    </Canvas>
  )
}
