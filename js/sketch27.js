/*
Matter.js test by piecesofuk referenced throughout the hour
https://editor.p5js.org/piecesofuk/sketches/rJxOzAKvm
*/
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Composite = Matter.Composite;
let engine, render, world
let boundaries = []
let particles = []
let wait = 100
let currentLine = 1
let code
class Boundary {
    constructor(x,y,w,h, angle) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.angle = angle
        let options = {
            isStatic: true,
            angle: angle,
            friction:0.3,
            restitution:0.6    
        }
        this.body = Bodies.rectangle(x,y,w,h, options)
        World.add(world, this.body)
    }
    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push()
        rectMode(CENTER)
        translate(pos.x,pos.y)
        rotate(angle)
        rect(0,0,this.w,this.h)
        pop()
    }
}
class Particle {
    constructor(x,y,r,txt) {
        this.x = x
        this.y = y
        this.r = r
        this.txt = txt
        this.awake = false
        this.options = {
            friction:0.3,
            restitution:0.6,
            isStatic:false
        }   
    }
    wake() {
        if (!this.awake) {
        this.body = Bodies.circle(this.x,this.y,this.r,this.options)
        World.add(world,this.body)}
        this.awake = true
        }
    show() {
        if (this.awake){
        const pos = this.body.position
        const angle = this.body.angle
        push()
        translate(pos.x,pos.y)
        rotate(angle)
        text(this.txt,0,0)
        pop()
    }
        else {
            text(this.txt,this.x,this.y)}
        }
}
function preload() {
    code = loadStrings('sketch27.js')
}
function newLine(arr, index) {
    const spacing = 0.8*width / arr[index].length
    for (let i =0;i<arr[index].length;i++) {
        particles.push(new Particle(spacing*i+0.1*width,20,3,arr[index].charAt(i)))
    }
}
function setup() {
    pixelDensity(1)
    const dim = min(windowWidth, windowHeight)    
    createCanvas(dim,dim)
    const len = 0.6*width
    const thickness = 0.1*height
    engine = Engine.create()
    world = engine.world
    const angle1 = atan2(height/2,width/2)
    const angle2 = atan2(height/2, -width/2)
    boundaries.push(new Boundary(len/2*Math.cos(angle1),len/2*Math.sin(angle1)+0.2*height,0.975*len,thickness,angle1))
    boundaries.push(new Boundary(width/2-len/2*Math.cos(angle2),len/2*Math.sin(angle2)+0.2*height,0.975*len,thickness,angle2))
    boundaries.push(new Boundary(len/2*Math.cos(-angle1),height-len/2*Math.sin(angle1),0.9*len,thickness,-angle1))
    boundaries.push(new Boundary(width/2-len/2*Math.cos(-angle2),height-len/2*Math.sin(angle2),0.9*len,thickness,-angle2))
    boundaries.push(new Boundary(width/2,height,width,thickness,0))
    newLine(code,0)
    Runner.run(engine)
}
function draw() {
    ellipseMode(CENTER)
    if (wait == 0) {
        currentLine ++
        wait = 200
        for (const particle of particles) {
            particle.wake()
        }
        if (currentLine < code.length) {
            newLine(code, currentLine)
        }
    }
    else {
        wait--
    }
    background(255)
    for (boundary of boundaries) {
        boundary.show()
    }
    for (particle of particles) {
        particle.show()
    }
}