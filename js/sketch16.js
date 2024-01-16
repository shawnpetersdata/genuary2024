let triangles = []
let maxDist
const xOff = Math.random()*10000
const yOff = Math.random()*10000
let fixed


class SplitTriangle {
    constructor(x,y,scl) {
        this.x = x
        this.y = y
        this.scl = scl
        this.r = random(30,255)
        this.g = random(30,255)
        this.b = random(30,255)
    }
    showSplit(light) {
        const distance = dist(this.x,this.y,light.x,light.y)
        const shadow = map(distance,0,maxDist,0.2*maxDist,0)
        const alpha = map(distance, 0, maxDist, 150,10)
        const weight = map(distance,0,maxDist,1,10)
        const angle = atan2(light.y-this.y,this.x-light.x)
noFill()

        const p1 = {x:this.x+shadow*Math.cos(angle),y:this.y-shadow*Math.sin(angle)}
        const p2 = {x:this.x+shadow*Math.cos(angle+Math.PI/12),y:this.y-shadow*Math.sin(angle+Math.PI/12)}
        const p3 = {x:this.x+shadow*Math.cos(angle-Math.PI/12),y:this.y-shadow*Math.sin(angle-Math.PI/12)}
        strokeWeight(weight)
        stroke(this.r,0,0,alpha)
        //line(this.x,this.y,p1.x,p1.y)
        triangle(p1.x-this.scl,p1.y+this.scl, p1.x + this.scl, p1.y+this.scl, p1.x , p1.y - this.scl)
        stroke(0,this.g,0,alpha)
        //line(this.x,this.y,p2.x,p2.y)
        triangle(p2.x-this.scl,p2.y+this.scl, p2.x + this.scl, p2.y+this.scl, p2.x , p2.y - this.scl)
        stroke(0,0,this.b,alpha)
        //line(this.x,this.y,p3.x,p3.y)
        triangle(p3.x-this.scl,p3.y+this.scl, p3.x + this.scl, p3.y+this.scl, p3.x , p3.y - this.scl)
    }
    show (buffer) {
        buffer.noFill()
        buffer.strokeWeight(1)
        buffer.stroke(this.r,this.g,this.b,255)
        buffer.triangle(this.x-this.scl,this.y+this.scl, this.x + this.scl, this.y+this.scl, this.x , this.y - this.scl)
        //circle(this.x,this.y,2)
       
    }
}

function setup() {
    createCanvas(0.8*windowWidth,0.8*windowHeight)
    maxDist = dist(0,0,width,height) * 1.25
    //need 2500 split triangles to total 10000
    fixed = createGraphics(width,height)
    fixed.background(0)
    
    for (let i = 0;i<2500; i++) {
        triangles.push(new SplitTriangle(random(0,1)*width,random(0,1)*height,random(0.1,5)))
    
    }
    for (const tri of triangles) {
        tri.show(fixed)
    }
}

function draw() { 
    image(fixed,0,0)
    const x = map(noise(frameCount/100 + xOff),0,1,0,width)
const y = map(noise(frameCount/100 + yOff),0,1,0,height)
for (const tri of triangles) {

        tri.showSplit({x:x,y:y})
    }
    noStroke()
    fill(255,255,255,100)
    circle(x,y,100)
}