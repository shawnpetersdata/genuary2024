//<script src="https://cdn.jsdelivr.net/npm/@davepagurek/p5.csg@0.0.1">
let footprint
let terrain
let buffer
let hills
let footpath

function preload() {
    
    footprint = loadModel('./resources/footprint.obj')
}

function sunlight(angle) {
    const x = 300
    const y = sin(angle-Math.PI) * 500;
    const z = cos(angle-Math.PI) * 500;

    const x2 = -600; 
    const y2 = sin(angle/100) * 400;
    const z2 = cos(angle/100) * 400;

  
    // Calculate the direction from sun position to the center
    const lightDirection = createVector(0, 0, 0).sub(x, y, z).normalize();
    const lightDirection2 = createVector(0, 0, 0).sub(x2, y2, z2).normalize();
  
    // Set up the spotlight parameters
    const lightColor = lerpColor(color(255,125,100), color(255, 255, 200), z/500) ;
    const lightPosition = createVector(x, y, z);
  
    const lightColor2 = color(150, 150, 255) ;
    const lightPosition2 = createVector(x2, y2, z2);
  

    // Create the spotlight
    spotLight(lightColor, lightPosition, lightDirection,Math.PI,1);
    spotLight(lightColor2, lightPosition2, lightDirection2,Math.PI,1);
  
    
  }

function landscape(arr) {
    let r = 200
    
    let new_arr = []
    while (new_arr.length < 10 && r > 10) {
        let x = random(-350,350)
        let y = random(-350, 350)
        let valid = true
        for (const obj of arr) {
            if (dist(obj.x,obj.y,x,y) < 60 + r) {
                valid = false                
            }
        }
        for (const hill of new_arr) {
            if (dist(hill.x,hill.y,x,y) < (r + hill.r)/2) {
                valid = false
            }
        }
        if (valid) {

            console.log(r)
            //(sr**2 - (h-sr)**2-r**2 = 0)
            //s**2 - h**2 -2*h*s + s**2 - r**2 = 0
            //2s**2 -2*h*s - (h**2+r**2)) = 0
            //const h = random(10,20)
            const h = random(100,200)
            const a = 2
            const b = -2*h
            const c = -1*(h**2+r**2)

            const sr = (-b+(b**2-4*a*c)**0.5)/(2*a)

            new_arr.push({x:x,y:y,r:r,sr:sr, h:h})
        }
        else {
            r--
        }

    }
    return new_arr
}

function footPath () {
    let path = [{x:0,y:0,angle:noise(0,0)*2*Math.PI-Math.PI/2}]
    let step = 100
    let forward = {x:step*Math.cos(noise(0,0)*2*Math.PI), y:step*Math.sin(noise(0,0)*2*Math.PI), angle:noise(0,0)*2*Math.PI-Math.PI/2}
    let backward = {x:-step*Math.cos(noise(0,0)*2*Math.PI), y:-step*Math.sin(noise(0,0)*2*Math.PI),angle:noise(0,0)*2*Math.PI-Math.PI/2}

    path.push(forward)
    path.push(backward)
    
    let running = true
    let safety = 100
    const noiseScl = 1000
    while(running && safety != 0) {
        safety --
        forward = {x:forward.x + step*Math.cos(noise(forward.x/noiseScl,forward.y/noiseScl)*2*Math.PI), y:forward.y + step*Math.sin(noise(forward.x/noiseScl,forward.y/noiseScl)*2*Math.PI), angle:noise(forward.x/noiseScl,forward.y/noiseScl)*2*Math.PI-Math.PI/2}
        backward = {x:backward.x - step*Math.cos(noise(backward.x/noiseScl,backward.y/noiseScl)*2*Math.PI), y:backward.y - step*Math.sin(noise(backward.x/noiseScl,backward.y/noiseScl)*2*Math.PI),angle:noise(backward.x/noiseScl,backward.y/noiseScl)*2*Math.PI-Math.PI/2}

        path.push(forward)
        path.push(backward)
        

        if ((Math.abs(forward.x) > 350 || Math.abs(forward.y) > 350) && 
        (Math.abs(backward.x) > 350 || Math.abs(backward.y) > 350)){
        running = false
        }
    }
    return path
}

function setup() {
    const dim = 700
    createCanvas(dim,dim,WEBGL)
    background(200)
    //

    footpath = footPath()
    hills = landscape(footpath)
    terrain = csg(() => {
        translate(0,0,10)
        box(800,800,100,4,4)})
    
    let tracks = csg(() => {
        model(footprint)
        translate(0,10)
        model(footprint)
    }).done()


    for (let hole of footpath) {
        
        const foot = csg(() => {
            push()
            //const y = random(-350,300)
            const y = hole.y
            const x = hole.x
            translate(x,y,60)
            scale(10)
            rotateZ(hole.angle)

            const pattern = [
                {x:-1,y:0},
                {x:2,y:2},
                {x:0,y:3},
                {x:-2,y:2}
            ]

            for (let i = 0; i<4; i++) {
                translate(pattern[i].x+random(-0.2,0.2),pattern[i].y+random(-0.2,0.2),random(-0.01,0.01))
                model(footprint)
            }

            /*
            translate(-1,0,0)
            model(footprint)
            translate(2,2,0)
            model(footprint)
            translate(0,3,0)
            model(footprint)
            translate(-2,2,0)
            model(footprint)
            */
            //model(tracks)
            pop()
            }).done()

            terrain = terrain.subtract(foot)
            //terrain = new_terrain
        
}
    terrain = terrain.done()

    //const footprintWrapper = buffer.csg(() => buffer.model(footprint))

    
    //terrain.done()

    

}

function draw() {
    //noLoop()
    //orbitControl()
    noStroke()
    
    sunlight(frameCount/500)
    rotateX(Math.PI/8)
    //rotateX(Math.PI/2)
    background(0)
    //lights()
    ambientLight(40)
    ambientMaterial(240,240,255)
    model(terrain)
    //x -300 to 200 at 0
    //x -250 to 175 at 300
    //x -350 to 250 at -350
    //y -350 to 300 at 0
    //
    push()
    translate(0,0,160)
    scale(2)
    //model(footprint)
    pop()

    for (let obj of footpath) {
        push()
        translate(obj.x,obj.y,160)
        //sphere(10)
        pop()
    }
    for (let hill of hills) {
        push()
        //translate(hill.x,hill.y,10-hill.h)
        translate(hill.x,hill.y,-hill.h)
        sphere(hill.sr)
        pop()
    }

    
    


    
}