//Photo by <a href="https://unsplash.com/@jlfader?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Julie Fader</a> on <a href="https://unsplash.com/photos/red-shed-with-wrecked-fences-under-blue-sky-and-white-clouds-during-daytime-jA3V61YJMH0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  
let panels = []
let palette
let edgeColor, borderColor, trianglePalette, arcPalette
let quilt
let backdrop
const meshSize = 30
let physics
let particles = []
let springs = []
const quiltScl = 0.75

class Particle extends toxi.physics2d.VerletParticle2D {
    constructor(x,y) {
        super(x,y)
    }
    show() {
        circle(this.x,this.y,5)
    }
}

class Spring extends toxi.physics2d.VerletSpring2D {
    constructor(p1,p2, len, k = 0.999) {
        super(p1,p2, len, k)
        this.p1 = p1
        this.p2 = p2
    }

    show() {
        stroke(0)
        strokeWeight(1)
        line(this.p1.x,this.p1.y,this.p2.x,this.p2.y)
    }
}

class Panel {
    constructor(x,y,w,h, color1, color2, type = "triangle") {
        this.tiles = []
        this.color1 = color1
        this.color2 = color2

        for (let j = 0; j<5; j++) {
            for (let i = 0; i<5; i++) {
                if (type == 'triangle') {
                    this.tiles.push(new  TriangleTile(i*0.2*w+x,j*0.2*w+y, 0.2*w, 0.2*h, this.color1, this.color2))
                }
                else {
                    this.tiles.push(new ArcTile(i*0.2*w+x,j*0.2*w+y, 0.2*w, 0.2*h, this.color1,this.color2))
                }
            }
        }
    }
    show() {
        for (const tile of this.tiles) {
            tile.show()
        }
    }
}

class ArcTile {
    constructor(x,y,w,h, color1, color2) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.choice = Math.floor(4*random())
        
        if (random() > 0.5) {
            this.color1 = color1
            this.color2 = color2
        }
        else {
            this.color1 = color2
            this.color2 = color1
        }



    }
    show() {
        quilt.drawingContext.setLineDash([3]);
        quilt.stroke(150,60)
        quilt.fill(this.color2)
        quilt.rect(this.x,this.y,this.w,this.h)
        if (this.choice == 0) {
            quilt.fill(this.color1)
            quilt.arc(this.x,this.y,this.w*1.3,this.h*1.3,radians(0),radians(90))
            quilt.fill(this.color2)
            quilt.arc(this.x,this.y,this.w*0.7,this.h*0.7,radians(0),radians(90))
        }
        else if (this.choice == 1) {
            quilt.fill(this.color1)
            quilt.arc(this.x+this.w,this.y,this.w*1.3,this.h*1.3,radians(90),radians(180))
            quilt.fill(this.color2)
            quilt.arc(this.x+this.w,this.y,this.w*0.7,this.h*0.7,radians(90),radians(180))
        }
        else if (this.choice == 2) {
            quilt.fill(this.color1)
            quilt.arc(this.x,this.y+this.h,this.w*1.3,this.h*1.3,radians(270),radians(360))
            quilt.fill(this.color2)
            quilt.arc(this.x,this.y+this.h,this.w*0.7,this.h*0.7,radians(270),radians(360))
        }
        else {
            quilt.fill(this.color1)
            quilt.arc(this.x+this.w,this.y+this.h,this.w*1.3,this.h*1.3,radians(180),radians(270))
            quilt.fill(this.color2)
            quilt.arc(this.x+this.w,this.y+this.h,this.w*0.7,this.h*0.7,radians(180),radians(270))
        }
    }
}


class TriangleTile {
    constructor(x,y,w,h, color1, color2) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.choice = Math.floor(2*random())
        this.color1 = random([color1,color2])
        this.color2 = random([color1,color2])
    }
    show() {
        quilt.drawingContext.setLineDash([3]);

        quilt.stroke(150,60)
        if (this.choice == 0) {
            quilt.fill(this.color1)
            quilt.beginShape()
            quilt.vertex(this.x, this.y)
            quilt.vertex(this.x+this.w,this.y+this.h)
            quilt.vertex(this.x, this.y+this.h)
            quilt.endShape(CLOSE)
            quilt.fill(this.color2)
            quilt.beginShape()
            quilt.vertex(this.x, this.y)
            quilt.vertex(this.x+this.w,this.y+this.h)
            quilt.vertex(this.x+this.w, this.y)
            quilt.endShape(CLOSE)
        }
        else {
            quilt.fill(this.color1)
            quilt.beginShape()
            quilt.vertex(this.x,this.y+this.h)
            quilt.vertex(this.x+this.w,this.y)
            quilt.vertex(this.x,this.y)
            quilt.endShape(CLOSE)
            quilt.fill(this.color2)
            quilt.beginShape()
            quilt.vertex(this.x,this.y+this.h)
            quilt.vertex(this.x+this.w,this.y)
            quilt.vertex(this.x+this.w,this.y+this.h)
            quilt.endShape(CLOSE)

        }
    }
}

function preload() {
    backdrop = loadImage("./resources/julie-fader-jA3V61YJMH0-unsplash.jpg")
}

function setup() {
    
    quilt = createGraphics(400,400)
    palette = [
        color(255,255,255),
        color(187,4,43),
        color(255,165,0),
        color(0,53,101),
        color(2,155,72),
        color(255,153,203)
            
    ]

    shuffle(palette,true)
    borderColor = palette.pop()
    edgeColor = palette.pop()
    trianglePalette = palette.splice(0,2)
    createCanvas(600,600, WEBGL)
    backdrop.resize(3*width,3*height)
    
    backdrop.filter(BLUR,2)
    quilt.fill(edgeColor)
    quilt.noStroke()
    quilt.rect(0,0,quilt.width,quilt.height)
    quilt.fill(borderColor)
    quilt.rect(0.02*quilt.width, 0.02*quilt.height,0.96*quilt.width,0.96*quilt.height)
    //12 "bits" for borders and edging
    //borders 1% each
    //edge 3% each side
    //leaves 88 for 5 (17.6 each)

    for (let i = 0; i<5;i++) {
        for(let j = 0; j<5; j++) {
            if ((i + j)%2 != 0) {
                
                panels.push(new Panel((0.03+i*0.191)*quilt.width,(0.03+j*0.191)*quilt.height,0.08*quilt.width,0.08*quilt.height,palette[0], palette[1],"arc"))

                panels.push(new Panel((0.03+i*0.191 + 0.0955)*quilt.width, 
                (0.03+j*0.191+0.0955)*quilt.height,0.08*quilt.width,0.08*quilt.height,palette[0], palette[1],"arc"))

                panels.push(new Panel((0.03+i*0.191 + 0.0955)*quilt.width, 
                (0.03+j*0.191)*quilt.height,0.08*quilt.width,0.08*quilt.height,trianglePalette[0], trianglePalette[1]))

                panels.push(new Panel((0.03+i*0.191)*quilt.width, 
                (0.03+j*0.191+0.0955)*quilt.height,0.08*quilt.width,0.08*quilt.height,trianglePalette[0], trianglePalette[1]))
                
            }
            else {
                panels.push(new Panel((0.03+i*0.191)*quilt.width,(0.03+j*0.191)*quilt.height,0.176*quilt.width,0.176*quilt.height,trianglePalette[0], trianglePalette[1]))
            }
    }
}
    for (const panel of panels){
        panel.show()
    }

    //physics

    physics = new toxi.physics2d.VerletPhysics2D()
    
    const gravity = new toxi.physics2d.behaviors.GravityBehavior(new toxi.geom.Vec2D(0,0.8))

    physics.addBehavior(gravity)
    const inc = 0.9/meshSize

    for (let i = 0; i<meshSize; i++) {
        for (let j = 0; j<meshSize; j++) {
            const particle = new Particle((i*inc+inc) * width*quiltScl,(j*inc+inc) * height*quiltScl)
        particles.push(particle)
        physics.addParticle(particle)
        }
    }

//left
particles[0].lock()
particles[meshSize].lock()
particles[2*meshSize].lock()

//centre
particles[Math.floor(meshSize/2)*meshSize].lock()
particles[(Math.floor(meshSize/2)+1)*meshSize].lock()
particles[(Math.floor(meshSize/2)-1)*meshSize].lock()

particles[meshSize*(meshSize-3)].lock()
particles[meshSize*(meshSize-2)].lock()
particles[meshSize*(meshSize-1)].lock()

for (let i = 0; i<meshSize;i++) {
    for (let j = 0; j<meshSize;j++) {
        if (i!=meshSize-1) {
            const spring1 = new Spring(particles[i+j * meshSize], particles[i+ j*meshSize+1], inc*height*quiltScl)
            springs.push(spring1)
            physics.addSpring(spring1)
        }
        
        if (j!=meshSize-1) {
            const spring2 = new Spring(particles[i+j*meshSize], particles[i+j*meshSize + meshSize],inc*width*quiltScl)
            springs.push(spring2)
            physics.addSpring(spring2)
        }
        
    }
}

}




function draw() {
    
    physics.update()
    if (frameCount > 20) {
    
    

    translate(-width/2,-height/2,0)
    background(255)
    image(backdrop,-backdrop.width/2,-backdrop.height*0.55)
    
    const wind = new toxi.geom.Vec2D(noise(frameCount/100)*0.25,noise(frameCount/1000)*0.1)
    for (const particle of particles) {
        particle.addForce(wind)
    }

    
   noFill()
   textureMode(NORMAL)
   push()
   translate((width*quiltScl)/5, height*quiltScl/3)
   strokeWeight(3)
   stroke(255)
   line(-width,particles[0].y,width,particles[0].y)
   noStroke()
   for (let j = 0; j<meshSize-1;j++) {
    texture(quilt)
    beginShape(TRIANGLE_STRIP)
    for (let i = 0; i<meshSize; i++) {
        vertex(particles[i+j*meshSize].x,particles[i+j*meshSize].y,j/(meshSize-1),i/(meshSize-1))
        vertex(particles[i+(j+1)*meshSize].x,particles[i+(j+1)*meshSize].y,(j+1)/(meshSize-1),i/(meshSize-1))
            }
    endShape()
   
}
pop()
}
}
