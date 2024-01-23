let blocks = []
let baseImg
let camera
let state = 'check'
let empty = {x:0,y:0}
const rotSpeed = 0.1
class Cube {
    constructor(x,y,z,w, data, location) {
        this.x = x
        this.y = y
        this.z=z
        this.w = w
        this.angle = 0
        this.angle2 = 0
        this.rotating = 'none'
        this.color = data.color
        this.target = {x:data.x, y:data.y}
        this.location = location
        this.moved = 0
    }
    move() {
        if (this.rotating == 'forward') {
            this.angle +=rotSpeed
        }
        else if (this.rotating == 'backward') {
            this.angle -=rotSpeed
        }
        if (this.rotating == 'left') {
            this.angle2 +=rotSpeed
        }
        if (this.rotating == 'right') {
            this.angle2 -=rotSpeed
        }

        if (this.rotating == 'forward' && this.angle > Math.PI/2) {
            this.rotating = 'none'
            this.x += this.w
            this.angle = 0
            state = 'check'

        }

        else if (this.rotating == 'backward' && this.angle < -Math.PI/2) {
            this.rotating = 'none'
            state = 'check'
            this.x -= this.w
            this.angle = 0
        }
        else if (this.rotating =="left" && this.angle2 > Math.PI/2) {
            this.rotating = 'none'
            state = 'check'
            
            this.angle2 = 0
            this.z -=this.w
        }
        else if (this.rotating =="right" && this.angle2 < -Math.PI/2) {
            this.rotating = 'none'
            state = 'check'

            this.angle2 = 0
            this.z +=this.w
        }
        
    }
    show() {
        ambientMaterial(this.color)
        push()
        translate(this.x,this.y,this.z)  
        if (this.rotating == "forward") {

            translate(this.w / 2, this.w/2, 0);
            rotateZ(this.angle)
            translate(-this.w / 2, -this.w/2, 0)
        }

        else if (this.rotating == "backward") {

            translate(-this.w / 2, this.w/2, 0);
            rotateZ(this.angle)
            translate(this.w / 2, -this.w/2, 0)
        }

        else if (this.rotating == 'left') {
            translate(0, this.w / 2, -this.w/2);

            rotateX(this.angle2)

            translate(0, -this.w / 2, this.w/2);


        }

        else if (this.rotating == 'right') {
            translate(0, this.w / 2, this.w/2);

            rotateX(this.angle2)

            translate(0, -this.w / 2, -this.w/2);


        }

        box(this.w)
        pop()
    }
}

function customSort(a,b) {
    const da = dist(a.location.x,a.location.y,a.target.x,a.target.y)
    const db = dist(b.location.x,b.location.y,b.target.x,b.target.y)
    if (a.moved == 0) {
        return -1
    }
    else if (b.moved == 0) {
        return -1
    }
    if (da == 0 && db == 0) {
        return a.moved - b.moved
    }

    else if (da == 0) {
        return -1
    }
    else if (db == 0) {
        return -1
    }

    if (db !== da) {
        return db - da 
    }

    return a.moved - b.moved

}

function preload() {
    const choice = Math.floor(random(9))
    baseImg = loadImage(`/resources/tinyart${choice}.jpg`)
}

function setup() {
    const dim = 0.8*min(windowWidth,windowHeight)
    const scl = 20
    createCanvas(dim,dim,WEBGL)
    camera = createCamera()
    camera.setPosition(-600,-600,-300)
    camera.lookAt(0,0,0)
    baseImg.resize(16,16)
    baseImg.loadPixels()

    const colours = []
    for (let i = 0; i<16;i++) {
        for (let j = 0; j<16; j++) {
            if (i == 0 && j==0) {
                continue
            }
            const index = (i + j*16) * 4
            colours.push({x:i,y:j,color:color(baseImg.pixels[index],baseImg.pixels[index+1],baseImg.pixels[index+2],baseImg.pixels[index+3])})
        }
    }
    
    shuffle(colours,true)
    
    for (let i = 0; i<16;i++) {
        for (let j = 0;j<16;j++) {
            if (i == 0 && j == 0) {
                continue
            }
            blocks.push(new Cube(i*scl-scl*8,0,j*scl-scl*8,scl,colours.shift(),{x:i,y:j}))
        }
    }

}
function draw() {
    if (state == 'check') {
        blocks.sort(customSort)
        const neighbours = blocks.filter((block) => {return dist(block.location.x, block.location.y, empty.x,empty.y) == 1})

        const mover = random(neighbours)
        blocks.forEach((block) => {block.moved++})
        temp = {x:0,y:0}
        temp.x = mover.location.x
        temp.y = mover.location.y
        if (mover.location.x > empty.x) {
            mover.rotating = 'backward'
            mover.location.x--
        }
        else if (mover.location.x < empty.x) {
            mover.rotating = 'forward'
            mover.location.x++
        }
        else if (mover.location.y > empty.y) {
            mover.rotating = 'left'
            mover.location.y--
        }
        else {
            mover.rotating = 'right'
            mover.location.y++
        }
        empty.x = temp.x
        empty.y = temp.y
        mover.moved = 0

        state = 'moving'
    }


    lights()
    //orbitControl()
    translate(0,70,-50)
    //rotateY(Math.PI/8)
    rotateY(-Math.PI/2)
    ambientMaterial('gray')
    background(120,150,200)
    push()
    translate(0,5)
    box(1000,10,1000)
    pop()
    translate(100,-25,-100)
    
for (const block of blocks) {

    block.move()
    block.show()
}

}