let cells = []

class Cell {
    constructor(x,y,coordX, coordY, w,h,palette) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.coordX = coordX
        this.coordY = coordY
        this.state = Math.floor(Math.random() * 2)        
        this.previousState = this.state
        this.neighbours = []
        this.lifetime = 0
        
        //this.color = random(palette)
        let noiseVal = noise(coordX/50, coordY/50)*(palette.length-1)
        let wholeNumber = Math.floor(noiseVal)
        let remainder = noiseVal - wholeNumber
        
        this.color = lerpColor(palette[wholeNumber], palette[wholeNumber + 1], remainder)
        
    }
    assignNeighbours(others,scl) {
        for (let i = -1; i<=1; i++) {
            let x = this.coordX + i
            if (x == -1) {
                x = scl-1
            }
            else if (x == scl) {
                x = 0
            }
            for (let j =-1; j<=1;j++) {
                let y = this.coordY + j
            
                if (y == -1) {
                    y = scl-1
                }
                else if (y == scl) {
                    y = 0
                }
            if (i == 0 && j == 0) {
                continue
            }
                for (const other of others) {
                    if (other.coordX == x && other.coordY == y) {
                        this.neighbours.push(other)
                    }
                }
            }
        }
        
    }
    updateState() {
        let full = 0
        for (const neighbour of this.neighbours) {
            if (neighbour.previousState == 1) {
                full ++
            }
        }
        if(this.previousState == 1 && (full < 2 || full > 3)) {
            this.state = 0
        }
        else if (this.previousState == 0 && full == 3) {
            this.state = 1
        }
        else {
            this.state = this.previousState
        }
    }
    update() {
        this.previousState = this.state
        if(this.previousState == 1) {
            this.lifetime ++
        }
    }
    show() {
        noStroke()
        if (this.state==1) {
            fill(this.color)
        }
        else {
            fill(255)
        }
        rect(this.x,this.y,this.w,this.h)
    }
    showRecord() {
        noStroke()
        this.color.setAlpha(this.lifetime)
        fill(this.color)
        rect(this.x,this.y,this.w,this.h)
    }
}

function drawBoard(cells) {
    for (const cell of cells) {
        cell.show()
    }
}

function updateBoard(cells) {
    for (const cell of cells) {
        cell.updateState()
    }
    for (const cell of cells) {
        cell.update()
    }
}

function setup() {
    let palette = [color(193,247,220), color(195,210,213),color(189,160,188), color(162,112,138),color(130,70,122)]
    createCanvas(0.8*min(windowWidth,windowHeight),0.8*min(windowWidth,windowHeight))
    background(0)
    const scl = 100
    const w = width / scl
    const h = height / scl
    for (let i = 0; i<scl; i++) {
        for (let j = 0; j<scl; j++) {
            cells.push(new Cell(i*w,j*h,i,j,w,h,palette))

        }
    }
    for (const cell of cells) {
        cell.assignNeighbours(cells,scl)
        
    }
    drawBoard(cells)
}

function draw() {
    if (frameCount < 255) {
    updateBoard(cells)
    drawBoard(cells)
    }
    else{
        noLoop()
        background(0)
        for (const cell of cells) {
            cell.showRecord()
        }
    }

}