let bg
let colours
let layer1,layer2,layer3

function setup() {
    dim = 0.8*min(windowWidth, windowHeight)
    createCanvas(0.8*windowWidth,0.8*windowHeight)
    layer1 = createGraphics(width,height)
    layer2 = createGraphics(width,height)
    layer3 = createGraphics(width,height)

    colours = [
        color(205,172,129),
        color(113,49,36),
        color(219,190,158),
        color(157,116,54),
        color(229,199,145),
        color(220,212,147),
        color(208,143,77),
        color(119,102,83),
        color(180,156,122),
        color(153,81,49)
    ]
    
}


function draw() {
    bg = random(colours)
    noLoop()
    clear()
    background(bg)
    //blendMode(MULTIPLY);
    blendMode(OVERLAY)
    //blendMode(HARD_LIGHT)
    //stroke(colours[0])
    //fill(colours[0])
    layer1.stroke(100)
    for (let k = 0; k<3;k++) {
    layer1.clear()
    for (let i = 0; i<width;i++) {
        for (let j = 0; j<height; j++) {
            if (noise(i/100+k,j+k) > 0.7) {
            layer1.point(i,j)
            }
        }
    }
    layer1.filter(BLUR,1)
    image(layer1,0,0)
}
    layer2.clear()
    layer2.noFill()
    layer2.strokeWeight(3)
    for (let j = 0; j<height;j+=10)
    {
        layer2.beginShape()
        
        for (let i =0; i<width;i++) {
            const vary = map(noise(i/100,j),0,1,-5,5)
            layer2.curveVertex(i,j+vary)
        }
        layer2.endShape()
    }
    layer2.filter(BLUR,3)
    image(layer2,0,0)
    layer3.clear()
   const xc = random(width)
   const yc = random(height)
    layer3.noFill()
    layer3.stroke(25)
    layer3.strokeWeight(2)
    layer3.beginShape()
    for (let r = random(height/4,height/2); r>random(10,50); r-=10) {
    for (let i = 0 ;i<2*Math.PI;i+=Math.PI/100) {
        let x = r*Math.cos(i)
        
        let y = r*Math.sin(i)
        y*=map(noise(y/100,x/100),0,1,0.5,1.5)
        x*=map(noise(x/100,y/100),0,1,5,15)
    
        
        x+=xc
        y+=yc
        layer3.curveVertex(x,y)
    }
    layer3.endShape(CLOSE)
    }
    layer3.filter(BLUR,2)
    image(layer3,0,0)
    
}

function mouseClicked() {
    redraw()
    noiseSeed(random(10000))
}