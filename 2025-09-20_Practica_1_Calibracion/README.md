# Práctica 1 - Calibración de Cámaras con Tablero de Ajedrez
2025-09-20

## Entornos
- Python (`Jupyter Notebook`, `OpenCV`, `Numpy`, `Matplotlib`)

## Estructura

```
2025-09-20_Practica_3_Calibracion/
├── assets/                 #Chessboard Images for Calibration.    
├── res/                    #Generated Content from implementations. Corrected Images
├── src/                    #Jupyter Notebook Source Code.
    ├── Práctica_1_Calibración.ipynb
├── README.md               #You are here man.        
```

## Calibración Cámara
```Python
#CAMERA CALIBRATION

# Chessboard dimensions
chessboard_size = (9, 6)

# Criterio de terminación de subpixeles
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

# 3D points
objp = np.zeros((np.prod(chessboard_size), 3), np.float32)
objp[:, :2] = np.mgrid[0:chessboard_size[0], 0:chessboard_size[1]].T.reshape(-1, 2)

objpoints = [] # 3D points
imgpoints = [] # 2D points

# Load data (images)
images = glob.glob("../assets/chessboard/*.jpeg")

#Find Corners
for i, fname in enumerate(images):
    img = cv2.imread(fname)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    ret, corners = cv2.findChessboardCorners(gray, chessboard_size, None)
    if ret:
        #Refine corner positions
        ref_corners = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
        
        #Save points
        objpoints.append(objp)
        imgpoints.append(ref_corners)

        #Save Image with detected corner positions
        c_img = img.copy()
        cv2.drawChessboardCorners(c_img, chessboard_size, ref_corners, ret)
        cv2.imwrite(f'../res/detected_corners/corners_{i}.jpg', c_img)

# Calibration

#Instrinsics: Camera Matrix, Distortion Coefficients - Extrinscics: rvecs (Rotation), tvecs (Translation)
ret, mtx, dist, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, gray.shape[::-1], None, None)

#Camera Matrix with Intrinsic Parameters : Focal Lenght (f_x, f_y), Optical Centers (c_x, c_y)
print("Camera Matrix:\n", mtx)
#Distortion Coefficients
print("Distortion Coefficients:\n", dist)

# Data set image example correction
img = cv2.imread(images[3])
h, w = img.shape[:2]

#Optimized Camera Matrix
newcameramtx, roi = cv2.getOptimalNewCameraMatrix(mtx, dist, (w,h), 1, (w,h))

#Undistort
dst = cv2.undistort(img, mtx, dist, None, newcameramtx)

#Crop Image by Region of Interest (ROI)
x, y, w, h = roi
dst = dst[y: y + h, x: x + w]

cv2.imwrite("../res/example_img.jpeg", img)
cv2.imwrite("../res/example_img_correction.jpeg", dst)
```
# Implementación

El objetivo principal de este proceso fue determinar los parámetros intrínsecos y los coeficientes de distorsión de una cámara específica.

Una lente de cámara introduce distorsiones (curvaturas), haciendo que las líneas rectas en el mundo real se vean curvas en la imagen. La calibración calcula matemáticamente esta distorsión y los parámetros internos de la cámara para poder corregir las imágenes y obtener mediciones precisas en aplicaciones de visión artificial.

La calibración se llevó a cabo utilizando el método del tablero de ajedrez y la librería OpenCV.

### Preparación de Puntos de Referencia (Puntos 3D)

Se definió un patrón de tablero de ajedrez con dimensiones conocidas (9x6 esquinas internas).

¿Qué se hizo? 
Se crearon las coordenadas 3D del mundo real (Puntos del Objeto) para todas las esquinas del tablero. Para simplificar, se asignaron coordenadas como (0, 0, 0), (1, 0, 0), etc., asumiendo que el patrón se encuentra en el plano Z=0 y que cada cuadrado tiene una unidad de tamaño. Estos puntos son la verdad conocida y la referencia fija del proceso.

### Detección de Esquinas en las Imágenes (Puntos 2D)

Se procesaron múltiples imágenes del patrón de ajedrez capturadas desde diferentes ángulos.

¿Qué se hizo? 
Para cada imagen:

Se detectaron automáticamente las esquinas del tablero de ajedrez.

Se refinó la posición de estas esquinas a nivel de subpíxel (mayor precisión que un píxel entero) mediante un algoritmo de optimización.

Se obtuvieron las coordenadas 2D de píxeles (Puntos de la Imagen) que corresponden a las esquinas detectadas.

![corner1](./res/detected_corners/corners_1.jpg)
![corner2](./res/detected_corners/corners_2.jpg)
![corner3](./res/detected_corners/corners_3.jpg)
![corner4](./res/detected_corners/corners_4.jpg)
![corner5](./res/detected_corners/corners_5.jpg)
![corner6](./res/detected_corners/corners_6.jpg)
![corner7](./res/detected_corners/corners_7.jpg)
![corner8](./res/detected_corners/corners_8.jpg)
![corner9](./res/detected_corners/corners_9.jpg)
![corner10](./res/detected_corners/corners_10.jpg)

#### Calibración

Aquí es donde se resuelve el problema matemático fundamental: encontrar la relación entre los puntos 3D conocidos y su proyección 2D observada.

¿Qué se hizo? Se utilizó la función de calibración de cámara de OpenCV, que toma como entrada todos los Puntos 3D (referencia) y todos los Puntos 2D (observación). La función realiza una optimización para calcular:

- Matriz Intrínseca (K): Los parámetros internos de la cámara (distancia focal fx​,fy​ y centro óptico cx​,cy​).

- Coeficientes de Distorsión (D): Un conjunto de valores (k1​,k2​,p1​,p2​,…) que cuantifican la distorsión radial y tangencial de la lente.

#### Corrección de Distorsión (Undistortion)

Una vez calculados los parámetros, se demostró su utilidad corrigiendo una imagen de prueba.

¿Qué se hizo?

Se utilizó la Matriz Intrínseca y los Coeficientes de Distorsión calculados para revertir el efecto de la distorsión de la lente en una imagen de ejemplo.

Se calculó una Matriz de Cámara Optimizada para obtener la mejor vista de la imagen corregida (reduciendo las áreas negras que aparecen en los bordes después de la corrección).

Se aplicó la corrección para producir una imagen sin distorsión, donde las líneas rectas del mundo real vuelven a aparecer como líneas rectas.

#### Resultados

![cor_1](./res/corrected/correction_1.jpeg)
![cor_2](./res/corrected/correction_2.jpeg)
![cor_3](./res/corrected/correction_3.jpeg)
![cor_4](./res/corrected/correction_4.jpeg)
![cor_5](./res/corrected/correction_5.jpeg)
![cor_6](./res/corrected/correction_6.jpeg)
![cor_7](./res/corrected/correction_7.jpeg)
![cor_8](./res/corrected/correction_8.jpeg)
![cor_9](./res/corrected/correction_9.jpeg)
![cor_10](./res/corrected/correction_10.jpeg)


## Correción de Video en Tiempo Real
```Python
with window:
    #MAIN LOGIC
    #Main WebCam binding (usual)
    #cap = cv2.VideoCapture(0)

    #iF USB Camera, Index is not necessarily 0
    for i in range(10):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            with button_output:
                print(f"Camera index: {i}")
            break

    while True:
        global ss_req, frame_c, ss_frame
        ret, frame = cap.read()
        if not ret:
            with button_output:
                print("Shit happens.")
                break
        
        h, w = frame.shape[:2]
        
        #Optimized Camera Matrix
        newcameramtx, roi = cv2.getOptimalNewCameraMatrix(mtx, dist, (w,h), 1, (w,h))
        
        #Undistorted frame -> corrected
        corrected = cv2.undistort(frame, mtx, dist, None, newcameramtx)
        
        # Side to side video feed. (Left Original, Right Corrected)
        s2sview = np.hstack((frame, corrected))
        
        #Captions
        cv2.putText(s2sview, "LIVE FEED", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
        cv2.putText(s2sview, "CORRECTED", (w + 10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
        cv2.putText(s2sview, "Stop cell execution to quit", (10, h - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                    

        # s2sview frame to RGB for displaying
        s2sview_rgb = cv2.cvtColor(s2sview, cv2.COLOR_BGR2RGB)



        #LIVE FEED
        display.clear_output(wait = True)
        plt.figure(figsize = (10, 5))
        plt.imshow(s2sview_rgb)
        plt.axis('off')
        plt.show()

        frame_c += 1
    
    cap.release()
    cv2.destroyAllWindows()
```

## Implementación
Dados los parámetros de la cámara **mtx** (Matriz) y **dist** (Distorsión), se realiza lo siguiente:

#### Matriz de Cámara Óptima (`getOptimalNewCameraMatrix`)

La función `cv2.getOptimalNewCameraMatrix` toma los parámetros originales (mtx, dist) y calcula una nueva y mejorada matriz de cámara (newcameramtx).

Esta matriz se ajusta para que la imagen corregida no muestre bordes negros feos o elimine demasiada información. El parámetro alpha (usado como 1 en tu código) controla cuántos píxeles inválidos se recortan:

Un valor de 1 mantiene todos los píxeles originales, incluso si la imagen corregida es más grande que el frame original (se genera un recuadro negro en los bordes).

Un valor de 0 recorta la imagen para que solo se muestren los píxeles válidos después de la corrección.

#### Aplicación de la Desdistorsión (`undistort`)

La función `cv2.undistort` es el paso central. Utiliza la matriz de cámara original (**mtx**), los coeficientes de distorsión (**dist**), y la nueva matriz óptima (**newcameramtx**) para remover la distorsión.

Así, por cada píxel en el frame de salida corregido:

- Calcula dónde estaría ese píxel en la imagen distorsionada original.

- Aplica una transformación inversa usando los coeficientes dist.

- Toma el valor de color de esa posición en el frame original.

El resultado es el frame donde todas las líneas que eran rectas en el mundo real vuelven a aparecer rectas en la imagen (corrected).

#### Visualización

Finalmente, los frames original (frame) y corregido (corrected) se combinan usando np.hstack (apilamiento horizontal) para crear la vista lado a lado (s2sview), permitiendo al usuario ver el resultado de la corrección en tiempo real.

#### Resultados
![rtcor](./res/real_time_corrected/real_time_correction_194.jpeg)
![rtcor1](./res/real_time_corrected/real_time_correction_293.jpeg)
![rtcor2](./res/real_time_corrected/real_time_correction_325.jpeg)
![rtcor3](./res/real_time_corrected/real_time_correction_333.jpeg)

#### Conclusión
En resumen, el proceso se basa en conocer la deformación de la lente mediante la calibración y luego aplicar una transformación matemática inversa a cada imagen en el stream de video.
