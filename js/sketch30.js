//most of the shader code comes from oneshade: https://www.shadertoy.com/view/ttVfRR

let customShader;

function preload() {
  customShader = loadShader('js/shader30.vert', 'js/shader30.frag');
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
customShader.setUniform("u_time", frameCount/100+100)



//plane(width)
beginShape(TRIANGLE_STRIP);
	vertex(-1, -1, 0);
	vertex(-1, 1, 0);
	vertex(1, -1, 0);
	vertex(1, 1, 0);
	endShape(CLOSE);
  
}
