let firstPlane
let c
let buffer
let starField
let shapes = []
let mirrors = []
let palette = ['#75f4f4','#90e0f3','#b8b3e9','#d999b9','#d17b88']

class ThreeD {
    constructor(x,y,z, w,h) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        this.h = h
        this.vx = Math.random()
        this.vy = 2*Math.random() - 1
        this.vz = 2*Math.random() - 1
        this.seed = random(10000)
        this.rx = random(0,2*Math.PI)
        this.ry = random(0,2*Math.PI)
        this.rz = random(0,2*Math.PI)
        this.color = random(palette)
    }

    reset() {
        this.vx = Math.random()

        this.x = -width/1.5
        
        if ((this.y) > height) {
            this.y = height - 1
            this.vy *= -1
        }
        else if (this.y < -height) {
            this.y = -height + 1
            this.vy *= -1
        }

        this.z = 0
    }

    move() {
        this.x += this.vx
        this.y += this.vy
        this.z -= this.vz

        this.z = constrain(this.z, -200,200)

        this.rx += map(noise(frameCount/1000, this.x/100, this.seed), 0,1,-0.01, 0.01)
        this.ry += map(noise(frameCount/1000, this.y/100, this.seed), 0,1,-0.01, 0.01)
        this.rz += map(noise(frameCount/1000, this.z/100, this.seed), 0,1,-0.01, 0.01)


        if (this.x > width ||
            this.y > height ||
            this.y < -height
        ) {
            this.reset()
        } 
    }
    
}

class Box extends ThreeD {
    constructor(x,y,z,w,h,d) {
        super(x,y,z,w,h,d)
        
    }
    show(canvas) {
        canvas.push()
        canvas.translate(this.x, this.y, this.z)
        canvas.rotateX(this.rx)
        canvas.rotateY(this.ry)
        canvas.rotateZ(this.rz)
        
        canvas.fill(this.color)
        canvas.noStroke()
        canvas.box(this.w, this.h)
        canvas.pop()
    }
}

class Torus extends ThreeD {
    constructor(x,y,z,w,h,d, detailX,detailY) {
        super(x,y,z,w,h,d)
        this.detailX = detailX
        this.detailY = detailY
    }
    show(canvas) {
        canvas.push()
        canvas.translate(this.x, this.y, this.z)
        canvas.rotateX(this.rx)
        canvas.rotateY(this.ry)
        canvas.rotateZ(this.rz)
        
        canvas.fill(this.color)
        canvas.noStroke()
        canvas.torus(this.w, this.h, this.detailX, this.detailY)
        canvas.pop()
    }
}

class Plane extends ThreeD {
    constructor(x,y, z, w,h) {
        super(x,y,z,w,h)
        
    }
    show(canvas) {
        canvas.push()
        canvas.translate(this.x, this.y, this.z)
        canvas.rotateX(this.rx)
        canvas.rotateY(this.ry)
        canvas.rotateZ(this.rz)
        canvas.rectMode(CENTER)
        canvas.noFill()
        canvas.rect(0,0,this.w, this.h)
        canvas.pop()
    }
    addTexture(canvas) {
        canvas.push()
        canvas.translate(this.x, this.y, this.z)
        canvas.rotateX(this.rx)
        canvas.rotateY(this.ry)
        canvas.rotateZ(this.rz)
        canvas.strokeWeight(5)
        canvas.stroke(255,10)
        
        canvas.texture(buffer)
        canvas.rectMode(CENTER)
        canvas.rect(0,0,this.w,this.h)
        canvas.pop()

    }



}

function setup() {
    let dim = min(0.8*windowWidth, 0.8*windowHeight)
    c = createCanvas(dim,dim, WEBGL)
    buffer = createGraphics(dim,dim,WEBGL)
    
    
    starField = createGraphics(dim*2,dim *2)
    
    for (let i = 0; i<250; i++) {
        starField.fill(255)
        starField.noStroke()
        starField.circle(random(0,starField.width), random(0,starField.height), random(1,4))
    }


    for (let i = 0; i<5; i++) {
        shapes.push(new Box(random(-width/2,width/2), random(-height/2,height/2),random(-10,0), random(10,50), random(10,50), random(10,50)))
        shapes.push(new Torus(random(-width/2,width/2), random(-height/2,height/2),random(-10,0), random(10,50), random(10,50), random(10,50),int(random(3,10)),int(random(3,10))))
    }
    
    for (let i = 0; i < 4; i++) {
        mirrors.push(new Plane(random(-width/2,width/2),random(-height/2, height/2),5-i*5, i*50,i*50))
    }
    
    

    
}
function draw() {
    
    rectMode(CENTER)
    c.translate(-width/2, -height/2)
    
    buffer.background('black')
    buffer.push()
    buffer.translate(-1.2*width, -1.2*height,-500)
    buffer.image(starField,0,0)
    buffer.pop()
    for (const shape of shapes) {
        shape.move()
        shape.show(buffer)
    }
    for (let mirror of mirrors) {
        mirror.move()
        mirror.show(buffer)
    }

    for (let i = 0; i<3; i++) {
        for (let mirror of mirrors) {
            mirror.addTexture(buffer)
        }

    }
    image(buffer, 0,0)

}