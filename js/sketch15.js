import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
//sketch js type = module
//palette inspired by Jackson Pollock. One: Number 31, 1950

let palette
let world
let started = false
let blobs = []
let ready = false
let groundColliderDesc
let c
let c3d
let currentColor
let orientation
let w,h

class PaintBlob {
    constructor(x,y,z,size, colour) {
        this.size = size
        this.ink = 100
        this.colour = colour
    this.rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x, y, z).setAdditionalMass(0.75)
    

    this.rigidBody = world.createRigidBody(this.rigidBodyDesc);
    //this.rigidBody.setLinvel(new RAPIER.Vector3(0,-10,0));
    this.rigidBody.setAngvel(new RAPIER.Vector3(random(-1,1),0,random(-1,1)));

// Create a cuboid collider attached to the dynamic rigidBody.
    this.colliderDesc = RAPIER.ColliderDesc.ball(size/2)//), size/2, size/2)
    .setRestitution(0.25);
    this.collider = world.createCollider(this.colliderDesc, this.rigidBody);
    }
    destroy() {
        world.removeCollider(this.collider);
        world.removeRigidBody(this.rigidBody);
    }
    show(canvas){
        let rot = this.rigidBody.rotation()
        let pos = this.rigidBody.translation();
        canvas.push()
        canvas.translate(pos.x, -pos.y, pos.z)
        canvas.rotateX(rot.x)
        canvas.rotateY(rot.y)
        canvas.rotateZ(rot.z)
        canvas.emissiveMaterial(this.colour)
        canvas.noStroke()
        canvas.sphere(this.size*2)
        canvas.pop()
    }
}

function splat(colour) {
    
    const rho = 1
        let xc = random(-100,100)
        let yc = random(-50,-75)
        let zc = random(-100,100)
        const offset = random(0,2*Math.PI)
        for (let layer = 5;layer > 0; layer--) {
        
        for (let i = 0; i<layer; i++) {

            blobs.push(new PaintBlob(xc+2*Math.cos(i*2*Math.PI/layer+offset),yc-layer,zc+2*Math.sin(i*2*Math.PI/layer+offset),rho+0.05*layer,colour))
        }
    }
        noFill()
        
            
        
        return blobs
}

function setup() {
    palette = [color(53,62,65),color(161,143,122), color(145,152,142),color(199,198,194),color(105,109,103),color(87,90,85)]
    currentColor = random(palette)
    if (windowWidth > windowHeight) {
        orientation = "landscape"
        w = 0.4 * windowWidth
        h = w
        createCanvas(w*2,h)

    }
    else {
        orientation = "portrait"
        h = 0.4*windowHeight
        w = h
        createCanvas(w,h*2)
    }
    background(100)
    console.log(orientation)
    
    //createCanvas(400,400,WEBGL)
    c = createGraphics(1000,1000)
    c3d = createGraphics(400,400, WEBGL)
    c3d.rotateX(-Math.PI/3)
    c.background(215,193,156)
    RAPIER.init().then(() => {  
        let gravity = { x: 0.0, y: -9.81, z: 0.0 };
        world = new RAPIER.World(gravity);
    
        // Create the ground
        groundColliderDesc = RAPIER.ColliderDesc.cuboid(100.0, 1, 100.0)
        .setTranslation(0.0, -100.0, 0.0);
        world.createCollider(groundColliderDesc);
        blobs = splat(currentColor)

        

        
        ready = true
        })
    }

function draw() {
    
    if (ready) {
        //for loop added to cut down on rendering
        //decrease for less choppiness, increase for quicker end results
        for (let i = 0; i<1; i++) {

        if (blobs.length == 0) {
            blobs = splat(currentColor)
            currentColor = random(palette)
            //c3d.rotateY(0.001)


        }
        
        c3d.background(20)
        
        
        //background(255);

        world.step();
        for (let blob of blobs) {
            blob.show(c3d)
            let pos = blob.rigidBody.translation()
        if(pos.y<-98 && Math.abs(pos.x)<100 && Math.abs(pos.z < 100)) {
            currentColor.setAlpha(map(blob.ink, 100,0,150,20))
            blob.ink--
            c.noStroke()
            let x = map(pos.x, -100,100, 0,1000)
            let y = map(pos.z,-100,100, 0,1000)
            const colour = blob.colour
            colour.setAlpha(10)
            c.fill(colour)
            c.circle(x,y,map(blob.ink, 100,0,20,5)*blob.size)
        }
            if (pos.y < -101) {
                blob.ink = 0
            }
        
            if (blob.ink == 0) {
                blob.destroy()
            
            }
            
            blobs = blobs.filter(blob=>blob.ink!==0)
            //console.log(blobs.length)
            //blobs = blobs.filter((b) => {return b.ink!=0})
        }
        

        c3d.push()
        let ground = groundColliderDesc.translation
        c3d.translate(ground.x, -ground.y,ground.z)
        let groundSize = groundColliderDesc.shape.halfExtents
        c3d.texture(c)
        c3d.box(groundSize.x*2, groundSize.y*2, groundSize.z*2)
        c3d.pop()
    }
        image(c3d,0,0,w,h)
        if (orientation == "landscape") {
            image(c,w,0,w,h)
        }
        else{
            image(c,0,h,w,h)
        }
    }
  }

window.setup = setup
window.draw = draw