float angle;
float scalef;
float xs, ys, xdir, ydir;
float x, y, z;
float WAmp, Freq;

int sz;

void setup() {
  //Aspect, 3D Renderer and FPS
  size(800, 600, P3D);
  frameRate(60);
  
  //Parameters initialization
  angle = 0.0f;
  sz = 30;
  
  scalef = 1.0f;
  
  xs = 3.5;
  xdir = 1.0;
  
  x = 0.0f;
  y = 0.0f;
  z = 0.0f;
  
  WAmp = 5.0;
  Freq = 1.5;
  
}


void draw() {
  
  background(211);
  
  //World Space Coordinates. Origin (0, 0) at middle of the scene.
  translate(width / 2, height / 2);
  
  //Angle in radians from ms
  angle = 0.1 * radians(millis());
  
  //X axis border collision detection
  if (x >= width / 2 - sz|| x <= - width / 2 + sz) {
    xdir *= -1;
  }
  
  //New X and Y positions
  x +=  xs * xdir;
  y += (WAmp * sin(Freq * angle));
  
  //Scale factor min factor 0.5, max factor 1.5
  scalef = 1 + 0.5 * cos((Freq / 6) * radians(millis()));
  
  //Begin of tranformations. TRS*v scheme
  pushMatrix();
  //Cube's Wireframe
  noFill();
  
  //Translation
  translate(x, y, z);
  
  //Rotations around cube's axis
  rotateX(angle);
  rotateY(-angle);
  rotateZ(angle);
  
  //Smooth Scaling
  scale(scalef);
  
  //Drawing
  box(sz);
  
  popMatrix();
  
}
