//Requires webcam access

//global scope

let capture
let particles = []
let coords = []
let finished = false
let previousPixels
let forced = []
let scl = 1
let maxR = 0
let avgR = 127
let avgG = 127
let avgB = 127

//particle class

class Particle {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.targetX = x
        this.targetY = y
        this.r = r
        this.grown = false;
        this.ax = 0
        this.ay = 0
        this.vx = 0
        this.vy = 0
    }
    grow() {
        if (!this.grown) {
            this.r += 1 / scl
        }
    }
    show(pixels) {
        const index = (int(this.targetX) + int(this.targetY) * capture.width) * 4
        const r = pixels[index]
        const g = pixels[index+1]
        const b = pixels[index+2]
        fill(r,g,b)
        circle(this.x, this.y, this.r*2)
    }
    done(arr) {
        if (this.growthCollision(arr)) {
            this.grown = true
        }
        
        
    }
    growthCollision(arr) {
        let collide = false
        if (this.x-this.r <= 0 || 
            this.x+this.r >= width ||
            this.y - this.r <= 0 ||
            this.y + this.r >= height) {
        
            this.grown = true
            return true
        }

        for (let particle of arr) {
            if (particle !== this) {
                if (dist(particle.x, particle.y, this.x, this.y) <= (particle.r + this.r + 1)) {
                    this.grown = true
                    particle.grown = true
                    collide = true
                    break
                }
            }
        }    
        return collide;
    }

    disturb(x,y) {
        const distance = dist(x,y,this.x,this.y) 
        if (distance < 10) {
            const angle = atan2(this.y-y,this.x-x)
            this.ax += map(distance,0,10,1,0)*Math.cos(angle)
            this.ay += map(distance,0,10,1,0)*Math.sin(angle)
        }
    }
    move() {

        //attractive restore
        const angle = atan2(this.y-this.targetY,this.x-this.targetX)
        const distance = dist(this.x,this.y,this.targetX,this.targetY)
        if (Math.abs(this.targetX - this.x) > 1) {
            this.x -= 1*Math.cos(angle)
        }
        else {
            this.x = this.targetX
        }
        if (Math.abs(this.targetY - this.y) > 1) {
            this.y -= 1*Math.sin(angle)
        }
        else {
            this.y = this.targetY
        }
        
        const collide = particles.filter((particle) => {
            return Math.abs(particle.x - this.x)<maxR*2 && Math.abs(particle.y - this.y) < maxR*2 && particle !== this
        })

        for (let other of collide) {
            const distance = dist(this.x, this.y, other.x, other.y) 
            if (distance < (this.r + other.r)) {
                
                const angle = atan2(other.y - this.y, other.x-this.x)
                this.ax -= 0.5*Math.cos(angle)
                this.ay -= 0.5*Math.sin(angle)

            } 
        }
        
        
        //apply total acceleration
        
        this.vx += constrain(this.ax,-1,1)
        this.vy += constrain(this.ay,-1,1)

        
        this.ax = 0
        this.ay = 0
        this.x += constrain(this.vx,-2,2)
        this.y += constrain(this.vy,-2,2)
        this.vx*=0.9
        this.vy*=0.9

        if (this.x < 0) {
            this.x = 5
            this.vx *= -0.5
        }
        else if (this.x > width/scl) {
            this.x = width/scl - 5
            this.vx *= -0.5
        }

        if (this.y < 0) {
            this.y = 5
            this.vy *= -0.5
        }
        else if (this.y > height/scl) {
            this.x = height/scl - 5
            this.vx *= -0.5
        }

        
    }
}

function motionDetected(x,y) {
    for (let particle of particles) {
        particle.disturb(x, y)
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function compareArrays(arr1, arr2) {
    
    let motion = []
    for (let i = 0; i < arr1.length; i+=4) {
        motion.push(Math.abs(arr1[i] - arr2[i]) + Math.abs(arr1[i+1] - arr2[i+1]) + Math.abs(arr1[i+2] - arr2[i+2]))
    }

    const threshold = 75
    const indexedMotion = motion.map((value, index) => {
        return { value, index};
    });
    
    indexedMotion.sort((a, b) => b.value - a.value);
    const topValues = indexedMotion.filter(item => item.value > threshold).slice(0,50);

    const topIndices = topValues.map(item => ({ index: item.index}));

    return topIndices

}

//p5.js


function setup() {
    createCanvas(min(windowWidth,windowHeight * 0.8), min(windowWidth,windowHeight *0.8));
    let w = 200
    let h = 200
    scl = min(windowHeight, windowWidth) / 200
    pixelDensity(1)
    const xOff = random(10000)
    const yOff = random(10000)

    for (let i = 1; i<width/scl-1; i+=5) {
        for (let j = 1; j<height/scl-1; j+=5) {
            coords.push([i+map(noise(i/10,j/10,xOff),0,1,-10,10),j+map(noise(i/10,j/10,yOff),0,1,-10,10)])
        }
    }

    shuffleArray(coords);


    let coord = coords.pop()
    particles.push(new Particle(coord[0],coord[1], 1))

    particleFill()

    particles.forEach((particle) => {
        if (particle.r > maxR) {
            maxR = particle.r
        }
    })
    
    //create capture

    capture = createCapture({
        audio: false,
        video: {
          width: w,
          height: h
        }
      })
    
    capture.size(w,h)
    capture.loadPixels()
    previousPixels = [...capture.pixels]
    capture.hide()
    
    //create field
}

function particleFill() {
    while(!finished) {
    count = 0
    total = 0
    while (total < 100 && count < 10000 && coords.length != 0 ) {
        count ++
        if (coords.length !=0) {
            let coord = coords.pop();
            const newParticle = new Particle(coord[0], coord[1], 1);
            if (!newParticle.growthCollision(particles)) {
                particles.push(newParticle);
                total ++
            }
        }
    }
    
    if (!finished) {
    const notGrown = particles.filter((particle) => {
        return !particle.grown
    })
    if (notGrown.length == 0) {
        finished = true
    }
    for (let particle of notGrown) {
        particle.done(particles);
        particle.grow()
    }
    
}
    }
} 
    


    
function adjustBackground() {
    let r = 0
    let g = 0
    let b = 0
    for (let i = 0; i<capture.pixels.length; i+=4) {
        r += capture.pixels[i]
        g += capture.pixels[i+1]
        b += capture.pixels[i+2]
    }

    const totalPixels = capture.pixels.length/4
   

    r /= totalPixels
    g /= totalPixels
    b /= totalPixels


    background (r,g,b)

}
    
function draw() {
    scale(scl,scl)
    capture.loadPixels()
    adjustBackground()
    noStroke()

    
    particles.forEach((particle) => {
        particle.move();
        particle.show(capture.pixels);
    });
    
    
    if (frameCount > 100) {
        //delay to avoid initial chaos while camera loads
        forced = compareArrays(previousPixels, capture.pixels)
    }
    previousPixels = [...capture.pixels]
    for (let index of forced) {
        
        motionDetected(index.index % capture.width,index.index / capture.width)
    }
}
