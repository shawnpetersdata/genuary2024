let wobbler
const scl = 10
let boats = []
let sunset

class Boat {
    constructor(x,y,scl = 1) {
        this.x = x
        this.y = y
        this.scl = scl
        this.delay = 0
    }
    move() {
        if (this.delay <= 0) {
            this.x -= this.scl/10
        }
        else {
            this.delay --
        }
        if (this.x+this.scl*30 < 0) {
            this.x = width + this.scl*30
            this.delay = random(0,100)
        }

    }
    show(wFunction, t) {
        fill(0)
        const y = this.y + map(wFunction.wobble(this.x/width,this.y/height,t),0,1,-0.1*height,0.1*height)

        rect(this.x, y-this.scl, 30*this.scl, 5*this.scl,5*this.scl,this.scl,this.scl*10,this.scl*10)
        triangle(this.x, y- 3*this.scl,this.x+this.scl*15,y- 3*this.scl,this.x+this.scl*15,y - this.scl*30,)
        triangle(this.x+this.scl*30, y- 2*this.scl,this.x+this.scl*16,y- 4*this.scl,this.x+this.scl*17,y - this.scl*30)

    }
}

class Wobbler {
    constructor() {
        //parameters that multiply x or y (inner and outer) 
        this.a = random(0,2*Math.PI)  //scale over x
        this.e = random(0,2*Math.PI)
        this.h = random(0,2*Math.PI)
        this.l = random(0,2*Math.PI)

        //t values, some should be negative to go against
        //integer values between 0 and 2*PI for perfect loops

        this.b = Math.floor(random(0,2*PI)) //scale over time
        if (Math.random() > 0.75) {
            this.b *= -1
        }
        this.f = Math.floor(random(0,2*PI))
        if (Math.random() > 0.75) {
            this.g *= -1
        }
        this.i = Math.floor(random(0,2*PI))
        if (Math.random() > 0.75) {
            this.i *= -1
        }
        this.m = Math.floor(random(0,2*PI))
        if (Math.random() > 0.75) {
            this.m *= -1
        }

        //phases between -PI and PI
        this.c = random(-Math.PI, Math.PI)//phase of wave
        this.g = random(-Math.PI, Math.PI)
        this.j = random(-Math.PI, Math.PI)
        this.n = random(-Math.PI, Math.PI)

        //amount of modulation
        this.d = random(0,2)
        this.k = random(0,2)
    }

    wobble(x,y,t) {
        const w0 = Math.sin(this.a * x + this.b * t + this.c + this.d *
            Math.sin(this.e * y + this.f * t + this.g))
        const w1 = Math.sin(this.h * y + this.i * t + this.j + this.k *
            Math.sin(this.l * x + this.m * t + this.n))
        return (w0 + w1 + 2) * 0.25
    }

}

function setup() {
    createCanvas(0.8*windowWidth, 0.8*windowHeight)
    wobbler = new Wobbler()
    for (let i = 0; i<10; i++) {
        const y = map(i,0,10,0.9*height, 0.5*height)
        boats.push(new Boat(random(0,2*width),y,map(y,0.5*height, 0.9*height,0.5,3)))
    }
    sunset = createGraphics(width,height)
    for (let i = 0; i<height*0.75;i++) {
        lerpColor(color(0, 0, 0), color(14, 45, 91), 0.75*i/height)
        sunset.stroke(lerpColor(color(0, 3, 10), color(14, 45, 91), i/height))
        sunset.stroke(lerpColor(color(14, 45, 91), color(241, 113, 24),i/height))
        
        sunset.line(0,i,width,i)
    }
}

function draw() {
    image(sunset,0,0)    


    
    
    
    for (let j = 0.5;j<1;j+=0.1 ) {
        fill(0,0,map(j,0,1,255,50),200)
        beginShape()
        for (let i = 0; i<1; i+= 0.05) {
            let y = wobbler.wobble(i, j, frameCount/100)
            vertex(i*width, j*height +map(y,0,1,-0.1*height,0.1*height))
        }
        let y = wobbler.wobble(1, j, frameCount/100)
            vertex(width, j*height +map(y,0,1,-0.1*height,0.1*height))
        vertex(width,height)
        vertex(0,height)
        endShape(CLOSE)
    }
    for (const boat of boats) {
        boat.move()
        boat.show(wobbler,frameCount/100)
}
}

    function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
    

}