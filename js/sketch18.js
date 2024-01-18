const [rows,cols] = [5,5]
const outlier = 0.95
const tiles = []
let palette
let bg
class Tile {
    constructor(x,y,w,h,ang1, ang2, vertical = true, offset = false) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.ang1 = ang1
    this.ang2 = ang2
    this.vertical = vertical
    this.offset = offset
    this.colour = palette[Math.floor(map(noise(this.x/100,this.y/100),0,1,0,palette.length))]


    
    
    
    this.arc = true
    this.visible = random()<outlier
    if (random() > outlier) {
        this.layers = 10
    }
    else {
        this.layers = 1
    }
    if(random() > outlier) {
    this.arc = false
        if (vertical) {
            
            this.w/=2
            this.y -= this.h/2
            if (offset) {
                this.x -= this.w/2
            //this.x-=this.w/2
        }
            else {
                this.x += this.w/2
            }
            
        }
        else {
            this.h/=2
            if (offset) {
                this.y -= this.h
            }
        }
        
    }


    }
    show() {
    
        noStroke()
    
        if (this.visible && this.arc){
            for (let i = 0; i< this.layers; i++) {
                let ring = map(i,0,this.layers,1,0.05)
                if (i %2 == 1) {
                    fill(bg)
                }
                else {
                    fill(this.colour)
                }
            arc(this.x,this.y,this.w*ring,this.h*ring,this.ang1,this.ang2,PIE)
            }
            
        }
        else if (this.visible) {
            if (this.vertical) {
                
                for (let i = 0; i< this.layers; i++) {
                        
                    if (i %2 == 1) {
                        fill(bg)//255
                    }
                    else {
                        fill(this.colour)
                    }
                    
                    let ring = this.w/2*map(i,0,this.layers,0,0.95)
                    if (this.offset) {
                        rect(this.x-this.w/2+2*ring,this.y+2*ring,this.w-(2*ring),this.h-(4*ring))
                    
                    }
                    else{
                        
                        rect(this.x-this.w/2,this.y+2*ring,this.w-(2*ring),this.h-(4*ring))
                    }
                }
            }
            else {
                    for (let i = 0; i< this.layers; i++) {
                        
                        if (i %2 == 1) {
                            fill(bg)//255
                        }
                        else {
                            fill(this.colour)
                        }
                        
                        let ring = this.w/2*map(i,0,this.layers,0,0.95)
                        if (this.offset) {
                            rect(this.x-this.w/2+ring,this.y+ring,this.w-(2*ring),this.h-(ring))
                        
                        }
                        else{
                            rect(this.x-this.w/2+ring,this.y,this.w-(2*ring),this.h-(ring))
                        }
                    }
                
                
                }
            }    
    }
    
}

function setup() {
    palette = [color(255,0,0),color(255,194,0),color(255,60,0),color(255,130,0)] //CBC 1974 - 1985
    let backgrounds = [color(0,0,198),color(255,255,255,color(0,0,0))]
    shuffle(palette,true)
    shuffle(backgrounds,true)
    bg = backgrounds.pop()

    noStroke()
    noFill()

const dim = 0.8*min(windowWidth,windowHeight)
const rInc = Math.round(dim/rows)
const cInc = Math.round(dim/cols)
    createCanvas(rInc*rows,cInc*cols)
    

for (let j=0; j<cols; j++) {
    for (let i = 0; i<rows; i++) {
        const pos = Math.floor(random(0,2))
        //const pos = 1
        if (pos == 0) {
            tiles.push(new Tile((i+0.5)*rInc,j*cInc,rInc,cInc,0,Math.PI,false))
            
            tiles.push(new Tile((i+0.5)*rInc,(j+1)*cInc,rInc,cInc,Math.PI,2*Math.PI,false,true))
        }
        else {
            tiles.push(new Tile(i*rInc,(j+0.5)*cInc,rInc,cInc,-Math.PI/2,Math.PI/2,true,false))
            tiles.push(new Tile((i+1)*rInc,(j+0.5)*cInc,rInc,cInc,Math.PI/2,-Math.PI/2,true, true))
        }


    }

}

}

function draw() {
    noLoop()
    background(bg)
    for (const tile of tiles) {
        tile.show()
    }
    
}