let gridSize
const segments = 20
let sections = []
let pens

class Section {
    constructor(x,y,loops) {
        this.x = x
        this.y = y
        this.loops = loops
        this.offset = random(10000)
        this.xc = gridSize/2+this.x + gridSize * random(-0.02, 0.02)
        this.yc = gridSize/2 + this.y + gridSize * random(-0.02, 0.02)
        this.seed = random(10000)
        this.pen = random(pens)
    }
    show() {
        angleMode(DEGREES)
        noiseSeed(this.seed)
        noFill()
        stroke(this.pen)
        let w = gridSize*1.2
        for (let loop = 0; loop < this.loops; loop++) {

            w /= 1.1**map(noise(loop/10 + this.offset,frameCount/1000),0,1,-1*loop,2*loop)

            
            let points = []

            let angle = map(noise(loop + this.offset,frameCount/100),0,1,20,70)

            for (let i = 0; i<4; i++) {
                const angleVar = map(noise(i+this.offset,frameCount/100),0,1,-5,5)
                const rVar = map(noise(i+this.offset,this.x,frameCount/1000),0,1,-0.1,0.1)*w/2

            points.push({
                x:this.xc + cos(angle+angleVar) * (w/2 + rVar),
                y:this.yc  + sin(angle+angleVar) * (w/2 + rVar)
            })
            angle+=90



        }
        beginShape()    
        for (let p of points) {
                
                //circle(p.x, p.y,5)
                vertex(p.x,p.y)

            }
        endShape(CLOSE)
        }

        
    }
}

function setup() {
    pens = [color(64,66,59),color(67,74,133),color(100,86,88),color(93,97,168), color(172,50,53)]
    createCanvas(0.8*min(windowWidth, windowHeight),0.8*min(windowWidth, windowHeight))
    gridSize = width / segments
    for (let i = 0; i<segments; i++) {
        for (let j = 0; j<segments; j++) {
            
            noFill()
            sections.push(new Section(i*gridSize,j*gridSize,    map(noise(i/2,j/2),0,1,0,15)))
            
        }
    }

    }

function draw() {
    background(255)
    for (let section of sections) {
        section.show()
    }
   
}