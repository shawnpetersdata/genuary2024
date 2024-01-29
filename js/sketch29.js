let customShader;

function preload() {
  customShader = loadShader('js/shader29.vert', 'js/shader29.frag');
}

function setup() {
    let dim = 0.8*min(windowWidth, windowHeight)
  createCanvas(dim,dim, WEBGL);
  noStroke();
  
}

function draw() {
  background(100);
    resolution = [width, height]
  shader(customShader);
  customShader.setUniform("u_resolution", resolution)
  customShader.setUniform("u_time", frameCount/100)
  
//plane(width)
beginShape(TRIANGLE_STRIP);
	vertex(-1, -1, 0);
	vertex(-1, 1, 0);
	vertex(1, -1, 0);
	vertex(1, 1, 0);
	endShape(CLOSE);
  
}
