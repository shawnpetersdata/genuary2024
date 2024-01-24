//basic shape comes from https://editor.p5js.org/ri1/sketches/-rnL0CGF

let customShape;
let customGrid
const startHue = Math.floor(Math.random() * 360)
const bg = (startHue + 180) % 360

class Penrose {
  constructor(x, y, shapeWidth, shapeHeight, hue,sat) {
    this.x = x + 0.02*shapeWidth
    this.y = y + 0.15 * shapeHeight
    this.shapeWidth = shapeWidth*2;
    this.shapeHeight = shapeHeight*2;
    this.hue = hue
    this.sat = sat
    this.strokeWeight = map(shapeWidth, 0,1000,0,15)
  }

  show() {
    stroke(0)
    strokeWeight(this.strokeWeight)
    fill(this.hue,this.sat,50)
    beginShape()
    vertex(this.x + 0.045 * this.shapeWidth, this.y + 0.3375 * this.shapeHeight)
    vertex(this.x, this.y + 0.2925 * this.shapeHeight)
    vertex(this.x + 0.1875 * this.shapeWidth, this.y)
    vertex(this.x + 0.3875 * this.shapeWidth, this.y + 0.245 * this.shapeHeight)
    vertex(this.x + 0.3075 * this.shapeWidth, this.y + 0.245 * this.shapeHeight)
    vertex(this.x + 0.20625 * this.shapeWidth, this.y + 0.1125 * this.shapeHeight)
    endShape(CLOSE)
    fill(this.hue,this.sat,25)
    beginShape()
    vertex(this.x + 0.045 * this.shapeWidth, this.y + 0.3375 * this.shapeHeight)
    vertex(this.x + 0.20625 * this.shapeWidth, this.y + 0.1125 * this.shapeHeight)
    vertex(this.x + 0.235 * this.shapeWidth, this.y + 0.155 * this.shapeHeight)
    vertex(this.x + 0.1425 * this.shapeWidth, this.y + 0.2925 * this.shapeHeight)
    vertex(this.x + 0.48 * this.shapeWidth, this.y + 0.2925 * this.shapeHeight)
    vertex(this.x + 0.4525 * this.shapeWidth, this.y + 0.3375 * this.shapeHeight)
    endShape(CLOSE)
    
    fill(this.hue,this.sat,75)
    beginShape()
    vertex(this.x + 0.1875 * this.shapeWidth, this.y)
    vertex(this.x + 0.21875 * this.shapeWidth, this.y)
    vertex(this.x + 0.48 * this.shapeWidth, this.y + 0.2925 * this.shapeHeight)
    vertex(this.x + 0.1425 * this.shapeWidth, this.y + 0.2925 * this.shapeHeight)
    vertex(this.x + 0.175 * this.shapeWidth, this.y + 0.245 * this.shapeHeight)
    vertex(this.x + 0.3875 * this.shapeWidth, this.y + 0.245 * this.shapeHeight)
    endShape(CLOSE)
  }
}

class CustomGrid {
    constructor(rows,cols) {
        this.rows = rows
        this.cols = cols
        this.w = width/rows
        this.h = height / cols
        this.grids = []
        this.coordGrid = Array(rows).fill().map(()=>Array(cols).fill(0))
    }
    populateGrid(startSize=4) {
        //console.log(this.coordGrid)
        let coords = [];
        let valid
        for (let k = startSize; k>1;k--) {
            this.coordGrid.forEach((row, index1) => {
                row.forEach((elem, index2) => {
                    if (elem === 0) {
                        coords.push({x:index1, y:index2});
                    }
                });
            })
            console.log(k)

        for (let i = 0; i<20;i++) {
            valid = true
            const coord = random(coords)
            
            if (this.coordGrid[coord.x][coord.y] == 1) {
                //print(coord, 'already full')
                continue
            }

            else if (coord.x + k > this.cols || coord.y + k > this.rows) {
                
                //console.log(coord.x,coord.y, 'out of range')
                
                continue
            }

            else {
                for (let i = 0; i<k;i++)
                 {
                        for (let j = 0; j<k;j++) {
                    if(this.coordGrid[coord.x+i][coord.y+j] == 1) {
                        valid = false
                        break
                    }
                    }
                }
            }
            if (valid) {
                fill(100,80)
                //rect(coord.x*this.w,coord.y*this.h,this.w*k,this.h*k)
                
                let penrose = new Penrose(coord.x*this.w, coord.y*this.h, this.w*k, this.h*k,startHue + map(noise(coord.x/10,coord.y/10),0,1,-150,150),75)
                penrose.show()
                for (let i = 0; i<k;i++)
                {
                    for (let j = 0; j<k;j++) {
                        this.coordGrid[coord.x+i][coord.y+j] = 1
                    }
                }
            }
        }
        
    }
    coords = []
    this.coordGrid.forEach((row, index1) => {
        row.forEach((elem, index2) => {
            if (elem === 0) {
                coords.push({x:index1, y:index2});
            }
        });
    })
    console.log(coords)
    for (const coord of coords) 
    
    {fill(100,80)
                //rect(coord.x*this.w,coord.y*this.h,this.w,this.h)
                
                let penrose = new Penrose(coord.x*this.w, coord.y*this.h, this.w, this.h,startHue+ map(noise(coord.x/10,coord.y/10),0,1,-150,150),75)
                penrose.show()
    }
}                

    show() {
        stroke(0)
        fill(100)
        for (let i = 0;i<=this.rows;i++) {
            for (let j = 0;j<=this.cols;j++) {
                circle(i*this.w,j*this.h,5)
            }
        }
        for (const grid of this.grids) {
            rect(grid.x*this.w,grid.y*this.h,10,10)
            
        }
    }
}

function setup() {
    let dim = 0.8*min(windowWidth, windowHeight)
    createCanvas(dim, dim);
    customGrid = new CustomGrid(20,20)
  }

  function draw() {
    noLoop()
    colorMode(HSL)
    background(bg, 100,80)
    //customGrid.show()
    customGrid.populateGrid(5)

    //colorMode(HSL)
    //customShape.drawShape();
  }