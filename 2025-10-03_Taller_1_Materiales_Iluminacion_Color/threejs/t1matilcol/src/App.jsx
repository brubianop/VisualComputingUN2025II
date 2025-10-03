import { Suspense, useCallback, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useAnimations, useGLTF, useTexture, CubeCamera, RenderTexture } from '@react-three/drei';
import * as THREE from 'three';

//-------------------------------- PRESETS ---------------------------------------//

// POSITIONS - ANIMATIONS REF
const CUBE_POSITION = new THREE.Vector3(160, 10, 112);

const SPHERE_RADIUS = 10;
const ORBIT_RADIUS = 25; // Distance from the Cube center to the Sphere
const ROTATION_SPEED = 0.005; 
//TEXTURES

const GROUND_TEXTURE = {
  map: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_Color.jpg",   
  normalMap: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_NormalGL.jpg", 
  roughnessMap: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_Roughness.jpg",
  aoMap: "/textures/Bricks097_1K-JPG/Bricks097_1K-JPG_AmbientOcclusion.jpg", 
}; 

const CUBE_TEXTURE = {
  map: "/textures/PavingStones138_1K-JPG/PavingStones138_1K-JPG_Color.jpg",   
  normalMap: "/textures/PavingStones138_1K-JPG/PavingStones138_1K-JPG_NormalGL.jpg", 
  roughnessMap: "/textures/PavingStones138_1K-JPG/PavingStones138_1K-JPG_Roughness.jpg",
  aoMap: "/textures/PavingStones138_1K-JPG/PavingStones138_1K-JPG_AmbientOcclusion.jpg",
};

const SPHERE_TEXTURE = {
  map: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_Color.jpg",   
  normalMap: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_NormalGL.jpg", 
  roughnessMap: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_Roughness.jpg",
  metalnessMap: "/textures/Metal049A_1K-JPG/Metal049A_1K-JPG_Metalness.jpg",
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
        position: [0, 80, 0],
        zoom: 2,
    },

];

// GLB Objects
//Main Object. Spartan
const mainObjPath = "/glb_models/spartan_armour_mkv_-_halo_reach.glb";

//Prop Object
const propObjPath = "/glb_models/combat_robot.glb";

//Environment Object
const envObjPath = "/glb_models/ussr_launch_site.glb";

//--------------------------------- OWN OBJECTS --------------------------------------------------------------//
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


function Sphere () {

  const meshRef = useRef();
  const reflectCamRef = useRef();
  const textures = useTexture(SPHERE_TEXTURE);

  const angle = useRef(0);

  const initialPos = [
    CUBE_POSITION.x + ORBIT_RADIUS, 
    CUBE_POSITION.y, 
    CUBE_POSITION.z
  ];

  // 💡 Animation
  useFrame((state, delta) => {

    const angleChange = delta * ROTATION_SPEED * 100;
    angle.current += angleChange;

    const x = CUBE_POSITION.x + Math.cos(angle.current) * ORBIT_RADIUS;
    const z = CUBE_POSITION.z + Math.sin(angle.current) * ORBIT_RADIUS;
    
    const y = CUBE_POSITION.y;
    
    if (reflectCamRef.current) {
      reflectCamRef.current.position.set(x, y, z);
    }
        
    if (meshRef.current) {
        const distanceTraveled = ORBIT_RADIUS * angleChange;
        const requiredRollAngle = distanceTraveled / SPHERE_RADIUS;

        meshRef.current.rotation.z += requiredRollAngle;  
    }
  });

  return (

    <CubeCamera
      ref = {reflectCamRef} 
      resolution = {256} 
      frames = {5} 
      near = {1} 
      far = {1500} 
      position = {initialPos}
    >

      {(renderTarget) => (
        <mesh 
          ref = {meshRef}
          position = {[0, 0, 0]}
          castShadow
          receiveShadow
          //reflections
          onBeforeRender = {({ gl, scene, camera }) => {
            if (meshRef.current) {
              meshRef.current.visible = false;
            }
          }}

          onAfterRender = {() => {
            if (meshRef.current) {
              meshRef.current.visible = true;
            }
          }}
        >

          <sphereGeometry args={[SPHERE_RADIUS, 128, 128]} />
          <meshStandardMaterial 
            {...textures}
            metalness = {1.0}
            envMap = {renderTarget.texture} 
          />
        </mesh>
      )}
    </CubeCamera>

  );
}

function Cube () {

  const meshRef = useRef();
  const textures = useTexture(CUBE_TEXTURE);

  return (
    <mesh 
      position = {[160, 10, 112]}
      castShadow
      receiveShadow
    >

      <boxGeometry args={[20, 20, 20]} />
      <meshStandardMaterial 
        {...textures}
      />
    </mesh>

  );
}

// ------------------------------------------ CRAP OBJECTS -----------------------------------------------------------//
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
  const controlRef = useRef();

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

      //Orthographic HARD reset
      if (controlRef.current) {
        if (curCams[activeCamIdx].name === "Orthographic") {
          controlRef.current.target.set(0, 0, 0); 
          nextCam.copy(nextCam); 
        } else { 
          controlRef.current.target.set(0, 0, 0);
        }
            
        controlRef.current.update();
      }

      //Orthographic edge case handling
      if (curCams[activeCamIdx].name === "Orthographic") {
        nextCam.updateProjectionMatrix();
      }
    }
  }, [activeCamIdx, curCams, set, activeSceneCam]);

  const curCamHandle = curCams[activeCamIdx].ref.current;

  const { size } = useThree();
  const halfWIDTH = size.width / 2;
  const halfHEIGHT = size.height / 2;


  return (
    <>

      <perspectiveCamera
        ref = {perspectiveCamRef}
        position = {cams[0].position}
        fov = {cams[0].fov}
        near = {1}
      />

      <orthographicCamera
        ref = {orthoCamRef}
        position = {cams[1].position}
        zoom = {cams[1].zoom}
        near = {1}
        far = {1000}

        top = {halfHEIGHT / cams[1].zoom}
        bottom = {-halfHEIGHT / cams[1].zoom}
        left = {-halfWIDTH / cams[1].zoom}
        right = {halfWIDTH / cams[1].zoom}
      />
      
      <OrbitControls 
        ref = {controlRef}
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
        intensity = {0.1}
      />

      <Environment 
        preset = "night"
        intensity = {0.2} 
        background = {false} 
      />

      {/*KEY LIGHT. i.e. HIGH INTENSITY. Enhances shadows.*/} 
      <directionalLight 
        position = {[150, 250, 150]} 
        intensity = {3.5} 
        color = {"#FFFFFF"} 
        castShadow

        //Light Frustum
        shadow-camera-near = {1} 
        shadow-camera-far = {300} 
        shadow-camera-left = {-280}  
        shadow-camera-right = {280} 
        shadow-camera-top = {200} 
        shadow-camera-bottom = {-200} 

        //ShadowMap res
        shadow-mapSize-width = {2048}
        shadow-mapSize-height = {2048}

        shadow-bias = {-0.0005}
      />

      {/*FILL LIGHT. i.e. LOW INTENSITY. Softens.*/} 
      <directionalLight 
        position = {[-50, 20, 50]} 
        intensity = {0.8} 
        color = {"#ADD8E6"} 
      />

      {/*RIM LIGHT. Object specific. Edges enhancing.*/} 
      <pointLight 
        position = {[-50, 50, -50]} 
        intensity = {1.2} 
        color = {"#FFFDD0"} 
      />

      <Ground />

      <Sphere />
      <Cube />
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
        
        outputEncoding: THREE.sRGBEncoding,
        dithering: true,
      }}
    >
      <Suspense fallback = {null}>
        <Scene />
      </Suspense>

    </Canvas>
  )
}
