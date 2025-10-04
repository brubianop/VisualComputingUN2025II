# Taller 1 Materiales, Iluminación y Color
2025-10-03

## Objetivo
Diseñar un **mundo virtual** en el que la **apariencia de los materiales** cambie de forma coherente según la **iluminación** y el **modelo de color**, integrando **modelos 3D (GLB)**, **texturas (incluidas procedurales)**, **movimiento animado**, y **cambio de cámara** entre vista **perspectiva** y **ortográfica**.

## Entornos
- Threejs (`React`, `React-Three-Fiber`, `React-Three-Drei`)

## Estructura

```
2025-10-03_Taller_1_Materiales_Iluminacion_Color/
├── glb_models/          #Modelos 3D en formato GLB  
├── renders/             #Renders escena creada     
├── textures/            #Texturas  
├── threejs/   
    ├── t1matilcol/      #Proyecto. Código fuente (src/App.jsx)
├── README.md               
```

## Implementación
El único entorno utilizado es Threejs. Los objetos que constituyen la escena, así como los materiales y texturas constituyen modelos de libre uso importados en formato `GLB`, extraidos de [Skecthfab](https://sketchfab.com/), y texturas PBR de [ambientCG](https://ambientcg.com/).

Dada la poca homogeneidad en la implemetnación de dichos modelos, algunos de ellos son cargados a la escena principal de manera distinta. El conflicto entre el entorno de `Threejs` y algunos de estos objetos no permite que algunos efectos, sombras y animaciones (si aplica) por ejemplo, puedan ser renderizadas. Sin embargo, el color, texturas, animaciones y mallas de los mismos son correctamente cargados en la escena.

Por esto último, tres objetos (`Ground`, `Cube`, y `Sphere`) hacen parte de la escena con el objetivo de mostrar las características dinámicas de la misma. Los materiales utilizados en estos son de tipo `PBR`, en donde algunas modificaciones a parámetros como `metalness` y `roughness` fueron realizadas con el objetivo de realzar los efectos visuales de la escena.

#### Código Relevante: Elementos de la Escena
```Javascript
function Scene () {

  return (
    <>

      <ambientLight
        intensity = {0.05}
      />

      <Environment 
        preset = "night"
        intensity = {0.1} 
        background = {true} 
      />

      {/*KEY LIGHT. i.e. HIGH INTENSITY. Enhances shadows.*/} 
      <directionalLight 
        position = {[150, 250, 150]} 
        intensity = {3.5} 
        color = {"#F0F8FF"} 
        castShadow

        //Light Frustum
        shadow-camera-near = {1} 
        shadow-camera-far = {300} 

        shadow-camera-top = {200} 
        shadow-camera-bottom = {-200}
        shadow-camera-left = {-120}  
        shadow-camera-right = {120}  

        //ShadowMap res
        shadow-mapSize-width = {2048}
        shadow-mapSize-height = {2048}

        shadow-bias = {-0.0005}
      />

      {/*FILL LIGHT. i.e. LOW INTENSITY. Softens. Opposite to Key.*/} 
      <directionalLight 
        position = {[-100, 50, 200]} 
        intensity = {0.8} 
        color = {"#87CEEB"} 
      />

      {/*RIM LIGHT. Object specific. CUBE Edges enhancing. Above.*/} 
      <pointLight 
        position = {[170, 60, 80]} 
        intensity = {5} 
        color = {"#FFC700"} 
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
```

## Etapas Realizadas
1. Documentación Threejs respecto a la carga de modelos, texturas y parámetros de los mismos.
2. Búsqueda elementos clave utilizados en una escena inspirada en el videojuego `Halo:Reach`.
3. Implementación escena inicial y posicionamiento de un esquema de 3 luces **Key** (`DirectionalLight`), **Fill** (`DirectionalLight`) , y **Rim** (`PointLight`).
4. Carga modelos `3D`, reescalado e importación de materiales de los mismos en la escena. `Animations` si aplica.
5. Modificación parámetros de `metalness`, `roughness` y demás en aquellos objetos cuyo `metalnessMap`, `aoMap` (Ambient Occlussion), `roughnessMap` no conseguía el constraste deseado.
6. Ajuste `color`, `intensity`, y `frustum` de cada una de las luces asegurando toda la escena se ve impactada por las mismas.
7. Implementación de `reflections` en objetos con alto valor de `metalness` (**Sphere**)
8. Uso de `Environment` como `Skybox` de la escena.
9. Renders de la escena.

# Escena
## Inspiración
![image](./assets/reach_logo.png)

Específicamente los objetos en la escena hacen alusión a una de las cinemáticas la mision <<**Long Night of Solace**>> del videojuego **Halo:Reach**. 

Dado que 2010 fue uno de los últimos años que valieron la pena, no solo en el desarrollo de videojuegos, **Halo:Reach** constituiría el último título lanzado por **Bungie** (mismo studio que desarrolló las 4 entregas anteriores de la saga) antes de partir como estudio independiente. Tenía que estar aquí una representación del mismo, por burda que parezca.

Evidentemente, alcanzar el mismo nivel de detalle con `javascript` es como pedir un `kernel` de OS con el mismo que sea eficiente. Buena suerte y me comenta.

Escena: [Sabre Launch](https://www.youtube.com/watch?v=DYcCuU4lrVw)  
Autor del clip: [11435](https://www.youtube.com/@11435)

## Modelos GLB

```
├── glb_models/  
    ├── combat_robot.glb
    ├── spartan_armour_mkv_-_halo_reach.glb
    ├── ussr_launch_site.glb
```
#### Combat Robot
![image](./assets/combat_robot.png)
**Geometry**
- Triangles: 87.9k
- Quads: 6.4k
- Polygons: 4.3k
- Total triangles: 122.1k

**General**
- Vertices: 63.6k
- PBR: metalness 
- Textures: 23
- Materials: 4
- UV Layers: Yes
- Vertex colors: No
- Animations: 0
- Rigged geometries: No
- Morph geometries: 0
- Scale transformations: No

Autor: [ilushandro](https://sketchfab.com/ilushandro)  
Link: [Combat Robot](https://sketchfab.com/3d-models/combat-robot-55fe65bbb4074979ac0cb44850df4ddc)


#### Spartan Armour Mk.V
![image](./assets/spartan_armour.png)

**Geometry**
- Triangles: 42.6k

**General**
- Vertices: 22.3k
- PBR: metalness 
- Textures: 45
- Materials: 9
- UV Layers: Yes
- Vertex colors: No
- Animations: 1
- Rigged geometries: Yes
- Morph geometries: 0
- Scale transformations: No

Autor: [McCarthy3D](https://sketchfab.com/joshuawatt811s)  
Link: [Spartan Armour MKV](https://sketchfab.com/3d-models/spartan-armour-mkv-halo-reach-57070b2fd9ff472c8988e76d8c5cbe66)


#### USSR Launch Site (Baikonur prob.)
![image](./assets/ussr_launch_site.png)
**Geometry**:
- Triangles: 5k
- Quads: 228.9k
- Polygons: 11.6k
- Total triangles: 574.1k

**General**
- Vertices: 318.1k
- PBR: No 
- Textures: 0
- Materials: 48
- UV Layers: Yes
- Vertex colors: No
- Animations: 0
- Rigged geometries: No
- Morph geometries: 0
- Scale transformations: No

Autor: [petrobus](https://sketchfab.com/peterobus)  
Link: [USSR Launch Site](https://sketchfab.com/3d-models/ussr-launch-site-324cda0e016e4d198006e2c8d3084b28)

## Iluminación

El esquema de iluminación utilizado consiste de 4 luces principales.
- Ambient Light
- Key Light
- Fill Light
- Rim Light

y un **preset**: `night` utilizado en `Environment` con el obejtivo de añadir una luz ambiental típica de un entorno nocturno con el fin de suavizar las sombras en la escena.Sumado a esto, se añade un `Skybox` con el obejtivo de ambientar la escena como en la cinemática de `Long Night of Solace`.

El objetivo de las 3 luces iniciales es el de crear una escena `Monocromática` (Matices de azúl en este caso) con colores `fríos`. Así es la atmósfera generada por `Long Night of Solace`, así es la atmósfera que se quiere recrear.

`Ambient Light`: Luz ambiental natural. Poca intensidad dado solo se busca que los objetos en la escena no aparezcan oscuros en su totalidad.

`Key Light`: Ilumina la escena en su totalidad y es aquella de mayor intensidad. El objetivo de esta es generar sombras con grandefinición sobre los objetos que impacta.En este caso, se busca en toda la escena se generen sombras y key light actúe como la luz, sumamente intensa, de la Luna. Color: `Alice Blue`, azúl tenue con el objetivo de tener una luz "blanca" de alta luminosidad sin serlo en su totalidad y generar un efecto de luz natural dirigída.

`Fill Light`: Ubicada de manera casi ortogonal a la Key Light. Tiene como objetivo generar menor contraste en la escena, dada la alta intensidad de la Key Light, y **suavizar** la misma junto con las sombras. Color: `Sky Blue`. Más oscuro que la Key light y con menor luminosidad.

Finalmente, la luz en la parte superior del `Cube` en la escena busca realzar ciertos matices sobre los bordes del mismo.

`Rim Light`: Luz de tipo **Point Light** de alta intensidad. Busca dar bordes de cierto color a las arístas del cubo que impacta. Color: `Golden`.

### Código Relevante

```javascript
<ambientLight
        intensity = {0.05}
      />

      <Environment 
        preset = "night"
        intensity = {0.1} 
        background = {true} 
      />

      {/*KEY LIGHT. i.e. HIGH INTENSITY. Enhances shadows.*/} 
      <directionalLight 
        position = {[150, 250, 150]} 
        intensity = {3.5} 
        color = {"#F0F8FF"} 
        castShadow

        //Light Frustum
        shadow-camera-near = {1} 
        shadow-camera-far = {300} 

        shadow-camera-top = {200} 
        shadow-camera-bottom = {-200}
        shadow-camera-left = {-120}  
        shadow-camera-right = {120}  

        //ShadowMap res
        shadow-mapSize-width = {2048}
        shadow-mapSize-height = {2048}

        shadow-bias = {-0.0005}
      />

      {/*FILL LIGHT. i.e. LOW INTENSITY. Softens. Opposite to Key.*/} 
      <directionalLight 
        position = {[-100, 50, 200]} 
        intensity = {0.8} 
        color = {"#87CEEB"} 
      />

      {/*RIM LIGHT. Object specific. CUBE Edges enhancing. Above.*/} 
      <pointLight 
        position = {[170, 60, 80]} 
        intensity = {5} 
        color = {"#FFC700"} 
      />

```

## Materiales y Texturas

Principio PBR: Everything is shiny.

```
├── textures/  
    ├── Bricks097_1K-JPG
    ├── Metal049A_1K-JPG
    ├── PavingStones138_1K-JPG
```
En cada textura de especifíca:
- Estructura de texturas
- `Texture Map` y su función controlando el aspecto de cada `Material`.
```Javascript
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
```


En todas las texturas se hizo uso de `NormalGl` dado Threejs opera con el mismo esquema de `OpenGL` en cuanto a coordenadas a diferencia de `DirectX`.

`Ground`: Utiliza `Bricks097` con un tiling de `50` con el objetivo de no "estirar" la textura y tener un acabado borroso de la misma (50 en U, 50 en V en el UV Map de Ground).
#### Código Relevante
```Javascript
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
```


`Cube`: Utiliza `Paving Stones138`. Aunque no se inclute un texture map de `Metalness`, con el objetivo de realzar, en exceso, los bordes iluminados por la Rim Light Dorada, se aumento el parámetro de `Metalness`: 0.3 en la `Mesh` del objeto. No `tiling`.
#### Código Relevante
```Javascript
<mesh 
      position = {[160, 10, 112]}
      castShadow
      receiveShadow
    >

      <boxGeometry args={[20, 20, 20]} />
      <meshStandardMaterial 
        {...textures}
        metalness = {0.3}
        roughness = {0.2}
      />
    </mesh>
```

`Sphere`: Utiliza `Metal049A`. Aunque dentro de los textures maps se incluye `Metalness`, se parametrizó en las opciones de `Material` de la `Mesh` un valor de `Metalness` : 1.0. Así, la esfera es tratada como una completamente metálica, en donde se producen reflejos.

#### Código Relevante
```Javascript
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
```

#### Bricks 097
Link: [ambientCG/Brick097](https://ambientcg.com/view?id=Bricks097)
![image](./assets/Bricks097.jpg)
```
├── Bricks097_1K-JPG/  
    ├── Bricks097_1K-JPG_AmbientOcclussion.jpg    #AoMap
    ├── Bricks097_1K-JPG_Color.jpg                #Color/Abedo
    ├── Bricks097_1K-JPG_NormalGL.jpg             #Normal
    ├── Bricks097_1K-JPG_Roughness.jpg            #Roughness
```

#### Metal 049A
Link: [ambientCG/Metal049A](https://ambientcg.com/view?id=Metal049A)
![image](./assets/Metal049A.jpg)
```
├── Metal049A_1K-JPG/  
    ├── Metal049A_1K-JPG_Color.jpg                #Color/Abedo
    ├── Metal049A_1K-JPG_Metalness.jpg            #Metalness /Gloss
    ├── Metal049A_1K-JPG_NormalGL.jpg             #Normal
    ├── Metal049A_1K-JPG_Roughness.jpg            #Roughness
```

#### PavingStones 138
Link: [ambientCG/PavingStones138](https://ambientcg.com/view?id=PavingStones138)
![image](./assets/PavingStones138.jpg)
```
├── PavingStones138_1K-JPG/  
    ├── PavingStones138_1K-JPG_AmbientOcclussion.jpg    #AoMap
    ├── PavingStones138_1K-JPG_Color.jpg                #Color/Abedo
    ├── PavingStones138_1K-JPG_NormalGL.jpg             #Normal
    ├── PavingStones138_1K-JPG_Roughness.jpg            #Roughness
```


## Cámaras
#### Código Relevante: Configuración Cámaras
```Javascript
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
```

Dos cámaras principales. Una en `perspectiva` y otra `ortogonal`. Es posible intercambiar entre ambas cámaras con la tecla `c`.

#### Código Relevante: Interacción con cámaras
```Javascript
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
```

#### Perspectiva
![image](./assets/perspective_view.png)
`Perspectiva`: Vista general de la escena en diágonal al centro de la misma. El objetivo principal de esta es el mostrar la escala de los objetos en escena. En esta escena, es la `cámara principal`.

#### Ortográfica
![image](./assets/orthographic_view.png)
`Ortogonal`: Vista `top-down` de la escena. El objetivo de esta es dar la ilusión de vista `satelital` típica de imágenes de este tipo. Centrada en el eje `y`. Justo encima del punto de orígen de la escena en su totalidad y alineada con el silo de lanzamiento.

## Animaciones

#### Cámaras

Control por medio del `mouse` con funcionalidades de `zoom`, `panning` y `rotation`. Con esto, el jugadortiene control total de la escena y puede desplazarse en la misma con el objetivo de observar los distintos elementos y como estos interactúan dinámicamente.

#### Esfera

La esfera de la escena cuenta con un `script` el cual permite que esta rote alrededor del cubo en al escena. El objetivo de esta rotación es el observar las `shadows` generadas por `Sphere` sobre la superficie de `Ground` y `Cube`. Además, observar como las `luces` y `skybox` de la escena se reflejan sobre la superficie de la `Sphere`. i.e. Demo técnica.




## Capturas y Escena Exportada

```
├── renders/  
    ├── exported_scenes                         #GLB. Escena Exportada
        ├── long_night_of_solace_tribute.glb
    ├── images                                  #Capturas                
    ├── gifs                                    #Duh
```

### Perspectiva
![image](./renders/images/perspective_scene_0.png)
![image](./renders/images/perspective_scene_1.png)
![image](./renders/images/perspective_scene_2.png)
![image](./renders/images/perspective_scene_3.png)
![image](./renders/images/perspective_scene_4.png)
![image](./renders/images/perspective_scene_5.png)
![image](./renders/images/perspective_scene_6.png)
![image](./renders/images/perspective_scene_7.png)
![image](./renders/images/perspective_scene_8.png)
![image](./renders/images/perspective_scene_9.png)

### Ortográfica
![image](./renders/images/orthographic_scene_0.png)
![image](./renders/images/orthographic_scene_1.png)
![image](./renders/images/orthographic_scene_2.png)
![image](./renders/images/orthographic_scene_3.png)
![image](./renders/images/orthographic_scene_4.png)
![image](./renders/images/orthographic_scene_5.png)
![image](./renders/images/orthographic_scene_6.png)
![image](./renders/images/orthographic_scene_7.png)
![image](./renders/images/orthographic_scene_8.png)
![image](./renders/images/orthographic_scene_9.png)


## GIFs

### Perspectiva
#### General
![image](./renders/gifs/perspective_scene_0.gif)

#### Reflejos Esfera. Highlights (Rim light) dorados Cubo.
![image](./renders/gifs/perspective_sphere_reflection.gif)

### Ortográfica
#### General
![image](./renders/gifs/orthographic_scene_0.gif)

#### Reflejos Esfera. Highlights (Rim light) dorados Cubo.
![image](./renders/gifs/orthographic_sphere_reflection.gif)

### Cambio entre Cámaras
![image](./renders/gifs/camera_switch.gif)

## Reflexión Final
Hecho.









