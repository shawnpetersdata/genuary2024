//Computer icon by Luca Burgio used by MIT License. Original available at https://iconduck.com/sets/iconoir-icon-library

const scl = 10
let cols, rows
let particles = []
const rOff = Math.random() * 10000
const gOff = Math.random() * 10000
const bOff = Math.random() * 10000
let icon
let countDown = 0

class Particle {
    constructor(x,y) {
        this.pos = createVector(x,y)
        this.vel = createVector(0,0)
        this.acc = createVector(0,0)
        this.history = []
    }
    move() {
        this.history.push(this.pos.copy())

        if (this.history.length > 30) {
            this.history.shift()
        }

        if (this.pos.x > width) {
            this.applyForce(createVector(-0.1,0))
        }
        else if (this.pos.x < 0) {
            this.applyForce(createVector(0.1,0))
        }
        if (this.pos.y > height) {
            this.applyForce(createVector(0,-0.1))
        }
        
        else if (this.pos.y < 0) {
            this.applyForce(createVector(0,0.1))
        }
        
        this.fieldEffect()


        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    fieldEffect() {
        let vec = p5.Vector.fromAngle(noise(this.pos.x/10, this.pos.y/10, frameCount/100) * TWO_PI)
        vec.setMag(0.01)
        this.applyForce(vec)
    }

    applyForce(force) {
        this.acc.add(force)
    }
    show() {
        circle(this.pos.x, this.pos.y, 10)
    }
}
function showCurrent() {
    for (let i = 0; i<3; i ++) {
    bezier(
        particles[0+i*3].pos.x, particles[0+i*3].pos.y,
        particles[1+i*3].pos.x, particles[1+i*3].pos.y,
        particles[2+i*3].pos.x, particles[2+i*3].pos.y,
        particles[3+i*3].pos.x, particles[3+i*3].pos.y,
    )
    }
        bezier(
        particles[9].pos.x, particles[9].pos.y,
        particles[10].pos.x, particles[10].pos.y,
        particles[11].pos.x, particles[11].pos.y,
        particles[0].pos.x, particles[0].pos.y,
    )
}

function showPast(limit) {
    let past = 40
    if(particles[0].history.length<limit) {
        return
    }
    for (let i = 4; i<limit; i+=10 ) {
        stroke(
            map(noise((frameCount - past)/1000+rOff),0,1,0,360),
            map(noise((frameCount- past)/1000+gOff),0,1,0,360),
            map(noise((frameCount-past)/1000+bOff),0,1,0,360),
            map(past, 0, 50, 255,10,true))
    //for (let i = 4; i<min(limit,10); i+=10 ) {    
        for (let j = 0; j<3; j++) {
        
            bezier(
                particles[0+j*3].history[i].x,particles[0+j*3].history[i].y,
                particles[1+j*3].history[i].x,particles[1+j*3].history[i].y,
                particles[2+j*3].history[i].x,particles[2+j*3].history[i].y,
                particles[3+j*3].history[i].x,particles[3+j*3].history[i].y
            )
            
    
        }
        bezier(
            particles[9].history[i].x,particles[9].history[i].y,
            particles[10].history[i].x,particles[10].history[i].y,
            particles[11].history[i].x,particles[11].history[i].y,
            particles[0].history[i].x,particles[0].history[i].y
        )
    past -=10
    }
    
}

function preload() {
    icon = loadImage(   "./resources/pc-warning.512x512.png")
}

function setup() {
    pixelDensity(1)
    createCanvas(min(windowWidth,windowHeight),min(windowWidth,windowHeight))
    cols = floor(width/scl)
    rows = floor(height/scl)
    for (let i = 0; i<12; i++) {
        particles.push(new Particle(random(width), random(height)))
}


}

function draw() {
    if (countDown == 0) {
        background(0,100)
        noFill()
        
        

        for (let particle of particles) {
            particle.move()
            //particle.show()
        }
        stroke(
            map(noise(frameCount/1000+rOff),0,1,0,360),
            map(noise(frameCount/1000+gOff),0,1,0,360),
            map(noise(frameCount/1000+bOff),0,1,0,360),
            255)
        showCurrent()
        
        showPast(min(30,frameCount))
    }
    else {
        background(255)
        image(icon,0,0,width,height)
        countDown --
        if (countDown == 0) {
            background(0)
        }
    }
}

function mouseMoved() {
    countDown = 100    
}
function mousePressed() {
    countDown = 100    
}

function mouseRelased() {
    countDown = 100    
}


function keyPressed() {
    countDown = 100
}
function keyReleased() {
    countDown = 100
}