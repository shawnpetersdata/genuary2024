// brain https://www.turbosquid.com/3d-models/brain-max-free/833681
let brain
const particles = []
let palette
const centralSize = 200


class Particle {
    constructor() {
        this.color = random(palette)
        this.position = createVector(random(-width/2,width/2), random(-height/2,height/2),random(-20,20))
        this.maxForce = 0.2
        this.maxSpeed = 6
        this.minSpeed = 2
        this.velocity = p5.Vector.random3D()
        this.velocity.setMag(random(this.minSpeed,this.maxSpeed))
        this.acceleration = createVector();
        
        this.inRange = false
    }

    edges() {
        let steering = createVector()
        const d = dist(this.position.x,this.position.y,this.position.z, width/2,height/2,0)
        let diff
        if (d > centralSize) {
            diff = p5.Vector.sub(createVector(0,0,0),this.position)
            steering.div(d**2)
        }
        else {
            return steering
        }
        steering.add(diff)
        steering.setMag(this.maxSpeed)
        steering.sub(this.velocity)
        steering.limit(this.maxForce*2)
        return steering
    }

    align(others) {
        let steering = createVector()
        let total = 0
        
        if (others.length > 0) {
            for (const other of others) {
                steering.add(other.velocity)
            }
            steering.div(others.length)
            
        }
        steering.setMag(this.maxSpeed)
        steering.sub(this.velocity)
        steering.limit(this.maxForce)
        return steering
    }

    separation(others) {
        let steering = createVector()
        if (others.length > 0) {
            for (const other of others) {
                const d = dist(this.position.x,this.position.y,this.position.z,other.position.x, other.position.y,other.position.z)
                const diff = p5.Vector.sub(this.position, other.position)
                diff.div(d**2)
                steering.add(diff)
            }
            steering.div(others.length)
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
        
        }
        steering.limit(this.maxForce)
        return steering
    }

    cohesion(others) {
        let steering = createVector()
        if (others.length > 0) {
            for (const other of others) {
                steering.add(other.position)

            }
            steering.div(others.length)
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
        }
        steering.limit(this.maxForce)
    return steering
    }

    flock(others) {
        const visionRadius = 50
        const limitedDist = others.filter((other) => dist(other.position.x, other.position.y,this.position.x,this.position.y) < visionRadius && other !== this)
        const alignment = this.align(limitedDist)
        const cohesion = this.cohesion(limitedDist)
        const separation = this.separation(limitedDist)
        const edgeForce = this.edges()

        this.force = createVector()

        this.force.add(alignment)
        this.force.add(cohesion)
        this.force.add(separation)
        this.force.add(edgeForce)



        this.force.limit(this.maxForce)

        this.acceleration.add(this.force)

    }

    update() {
        
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)

if (this.velocity.mag() < this.minSpeed) {
    this.velocity.setMag(this.minSpeed)
}

        this.acceleration.mult(0)




    }

    show() {
        push()
        ambientMaterial(this.color)
        translate(this.position.x, this.position.y, this.position.z)
        rotateY(atan2(this.velocity.z,this.velocity.x))
        rotateX(atan2(-this.velocity.y, (this.velocity.x**2 + this.velocity.z**2)**0.5))
        rotateZ(Math.PI/3)
        cone(5,10)
        pop()
    }

}

function preload() {
    brain = loadModel("/resources/Brain_Model.obj") 
}
function setup() {
    palette = [
        color(33,33,99),
        color(34,34,34),
        color(66,33,66),
        color(85,107,47),
        color(122,128,144)
    ]
    createCanvas(0.8*windowWidth, 0.8*windowHeight, WEBGL)
    for (let i = 0; i<100; i++) {
        particles.push(new Particle())
    }
}

function draw() {
    rotateY(frameCount/1000)
    background(0)

    noStroke()
    const nearby = particles.filter((p) => {
        return dist(p.position.x,p.position.y,p.position.z, 0,0,0) < centralSize
    }).length

    const focus = map(nearby,0,100,50,0)

    lights()
    directionalLight(focus,focus,focus,0,0,-1)
    ambientMaterial(242,174,177)
    push()
    rotateX(Math.PI)
    rotateY(Math.PI)
    translate(0,-50,0)
    scale(100)
    model(brain)
    pop()
    sphere(30)



    for (const particle of particles) {
        particle.flock(particles)
    }

    for (const particle of particles) {
        particle.update()
        particle.show()
    }
}