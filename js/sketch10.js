let tiles = []
const scl = 20
class Hexagon {
    constructor(x,y,h) {
        this.x = x
        this.y = y
        this.h = h
        this.w = 3**0.5 * this.h / 2
        this.color = lerpColor(color(228,87,46),color(231,241,39), (x+y)/(width + height))
        const order = shuffle([
            {x:0,y:-this.h/2},
            {x:0,y:this.h/2},
            {x:-this.w/2, y:this.h/2*Math.sin(Math.PI/6)},
            {x:-this.w/2, y:-this.h/2*Math.sin(Math.PI/6)},
            {x:this.w/2, y:this.h/2*Math.sin(Math.PI/6)},
            {x:this.w/2, y:-this.h/2*Math.sin(Math.PI/6)}
        ])
        this.p1 = order[0]
        this.p2 = order[1]

    }
    show() {
        push()
        strokeWeight(2)
        stroke(this.color)
        translate(this.x, this.y)

        line(this.p1.x,this.p1.y,this.p2.x,this.p2.y)
        pop()
    }
}

function setup() {
    
    createCanvas(0.8*min(windowWidth,windowHeight),0.8*min(windowWidth,windowHeight))
    
    for(let offset = 0; offset <= 1; offset ++) {
        for (let j = offset*scl/4 + scl/4; j<height; j+=scl/2) {

            for (let i = offset*scl*(3**0.5)/4-3**0.5*4; i<width; i+=scl*(3**0.5)/2) {
                tiles.push(new Hexagon(i, j,scl/2))
            }
        }
    }
    


    
}

function draw() {
    noLoop()
    background(240,248,234)
    for (let hex of tiles) {
        hex.show()
    }
}