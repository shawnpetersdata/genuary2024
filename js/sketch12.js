let blobs = []
let cols
let rows
const incr = 4
let contourCells = []
let contourPoints = []
let gridBuffer
let voids = []

class ContourPoint {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.intersected = false
        this.val
    }
    show(buffer) {
        if (this.intersected) {
            buffer.fill(0)
        }
        else {
            buffer.fill(255)
        }
        
        buffer.circle(this.x,this.y,5)
    }
    check(arr, arr2, buffer) {
        let intersect = false
        let val = 0
        for (let object of arr) {
            val += object.r**2 / ((this.x-object.x) ** 2 + (this.y-object.y)**2)    
}
for (let object of arr2) {
    val -= object.r**2 / ((this.x-object.x) ** 2 + (this.y-object.y)**2)    
}

this.val = max(val,0)
if (val > 1) {
    intersect = true

            //if (dist(this.x, this.y, object.x,object.y) < object.r) {
            //    intersect = true
            //    break
            //}

        
        
            
        }
        if (this.intersected != intersect) {
            this.intersected = intersect
            //this.show(buffer)
        }
    }
}

class ContourCell {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        
        
        
        
        this.points = []
        this.status = 0
    }

    show(buffer) {

        this.status = 8 * this.points[0].intersected +
        4 *this.points[1].intersected +
        2 * this.points[2].intersected + 1 * this.points[3].intersected


        let amount
//p1

        //const p1 = {x:this.x + this.w/2, y: this.y}
        
        //amount = (1 - this.points[0].val) / (this.points[1].val - this.points[0].val)
        amount = (1 - this.points[0].val) / (this.points[1].val - this.points[0].val)
        
        //if (amount < 0) {amount == 0}
        
        const p1 = {x:lerp(this.x, this.x+this.w,amount), y: this.y}
        
        amount = (1 - this.points[1].val) / (this.points[2].val - this.points[1].val)
        
        const p2 = {x:this.x+this.w, y:lerp(this.y, this.y+this.h,amount)}
        
        amount = (1 - this.points[3].val) / (this.points[2].val - this.points[3].val)
    
        const p3 = {x:lerp(this.x, this.x+this.w,amount),y:this.y+this.h}
        
        amount = (1 - this.points[0].val) / (this.points[3].val - this.points[0].val)
        const p4 = {x:this.x, y:lerp(this.y, this.y+this.h,amount)}
       
        //buffer.fill(0,217,192)
        //buffer.noStroke()
        
        //buffer.rect(this.x,this.y,this.w,this.h)
        //buffer.stroke(0)
        buffer.fill(color(240,45,58))
        buffer.noStroke()
        switch(this.status) {
            case 1:
                buffer.beginShape()
                buffer.vertex(p4.x,p4.y)
                buffer.vertex(p3.x,p3.y)
                buffer.vertex(this.x, this.y+this.h)
                buffer.endShape(CLOSE)
                
                
                
                break
                
                

            
            case 2:
                
                buffer.beginShape()
                buffer.vertex(p3.x,p3.y)
                buffer.vertex(p2.x,p2.y)
                buffer.vertex(this.x+this.w, this.y+this.h)
                buffer.endShape(CLOSE)
                
                

                break

            
            case 3:

                buffer.beginShape()
                buffer.vertex(this.x+this.w, this.y+this.h)
                buffer.vertex(this.x, this.y+this.h)
                
                buffer.vertex(p4.x,p4.y)
                buffer.vertex(p2.x,p2.y)
                
                buffer.endShape(CLOSE)
                
               

               
               

                break

            case 4:

                buffer.beginShape()
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(p2.x,p2.y)
                buffer.vertex(this.x+this.w, this.y)
                buffer.endShape(CLOSE)
                
              
                break

            case 5:
                
                buffer.beginShape()
                buffer.vertex(p4.x,p4.y)
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(this.x+this.w, this.y)
                buffer.vertex(p2.x,p2.y)
                buffer.vertex(p3.x,p3.y)
                buffer.vertex(this.x,this.y+this.h)
                buffer.endShape(CLOSE)
                
                
               
            case 6:
     
                buffer.beginShape()
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(this.x+this.w,this.y)
                buffer.vertex(this.x+this.w,this.y+this.h)
                buffer.vertex(p3.x,p3.y)
                buffer.endShape(CLOSE)
          

            break

            case 7:

                buffer.beginShape()
                buffer.vertex(p4.x,p4.y)
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(this.x+this.w, this.y)
                buffer.vertex(this.x+this.w, this.y+this.h)
                buffer.vertex(this.x, this.y+this.h)
                buffer.endShape(CLOSE)
                
              


                break

            case 8:

                buffer.beginShape()
                buffer.vertex(p4.x,p4.y)
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(this.x, this.y)
                buffer.endShape(CLOSE)
                //here


                
                break

            case 9:

                buffer.beginShape()
                buffer.vertex(this.x,this.y)
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(p3.x,p3.y)
                buffer.vertex(this.x, this.y+this.h)
                buffer.endShape(CLOSE)    

                

                break

            case 10:

                buffer.beginShape()
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(p2.x,p2.y)
                buffer.vertex(this.x+this.w, this.y+this.h)
                buffer.vertex(p3.x,p3.y)
                buffer.vertex(p4.x,p4.y)
                buffer.vertex(this.x,this.y)
                buffer.endShape(CLOSE)
                
                
                
                break


                
            case 11:

                buffer.beginShape()
                buffer.vertex(p1.x,p1.y)
                buffer.vertex(p2.x,p2.y)
                buffer.vertex(this.x+this.w, this.y+this.h)
                buffer.vertex(this.x, this.y+this.h)
                buffer.vertex(this.x, this.y)
                buffer.endShape(CLOSE)              
                
               

                break
                
            case 12:

                buffer.beginShape()
                buffer.vertex(this.x, this.y)
                buffer.vertex(this.x+this.w, this.y)
                buffer.vertex(p2.x,p2.y)
                buffer.vertex(p4.x,p4.y)
                buffer.endShape(CLOSE)    

               
                break

            case 13:
                
                buffer.beginShape()
                buffer.vertex(p2.x,p2.y)
                buffer.vertex(p3.x,p3.y)
                buffer.vertex(this.x, this.y+this.h)
                buffer.vertex(this.x, this.y)
                buffer.vertex(this.x+this.w, this.y)

               buffer.endShape(CLOSE)
                break

            case 14:
                buffer.beginShape()
                buffer.vertex(p3.x,p3.y)
                buffer.vertex(p4.x,p4.y)
                buffer.vertex(this.x, this.y)
                buffer.vertex(this.x+this.w, this.y)
                buffer.vertex(this.x+this.w, this.y+this.h)

                buffer.endShape(CLOSE) 
                
                
                
                
                break

            case 15:
                buffer.rect(this.x,this.y,this.w,this.h)
                break

}
        

    }
    check(buffer) {
        const newStatus = 8 * this.points[0].intersected +
        4 *this.points[1].intersected +
        2 * this.points[2].intersected + 1 * this.points[3].intersected

        if (newStatus != this.status) {
            this.status = newStatus
            //this.show(buffer)
        }

        this.show(buffer)
    

        
    }

}

class NegativeBlob {
    constructor(x,y,maxR) {
        this.x = x
        this.y = y
        this.r = 0
        this.maxR = maxR
        this.growing = true
    }
    update() {
        if(this.growing) {
            this.r+=0.2
        }
        else {
            this.r-=0.2
        }
        if (this.r >= this.maxR) {
            this.growing = false
        }
        else if (this.r <= 0) {
            this.done = true
        }
    }
    show() {
        noFill()
        stroke(0)
        //circle(this.x,this.y,this.r)
    }
}

class Blob {
    constructor(x,y,r, dir = 1, pos = 0) {
        //pos 0 --> bottom
        //1 --> left
        //2 --> top
        //3 --> right
    this.x = x
    this.y = y
    this.r = r
    this.seed = random(10000)
    this.delay = random(20,100)
    //this.delay = 0
    this.pos = pos
    this.direction = dir
    if (pos % 2 == 0) {
        this.target = x
    }
    else {
        this.target = y
    }
    switch(pos) {
        case 0:
        this.lower = gridBuffer.height
        this.upper = gridBuffer.height/2
        
        break
case 1:
    this.lower = 0
    this.upper = gridBuffer.width/2
    break
        case 2:
            this.lower = gridBuffer.height/2
            this.upper = 0
            break
    
    case 3:
    this.lower = gridBuffer.width/2
    this.upper = gridBuffer.width
    }
}

    
 move() {
    if(this.delay > 0) {
        this.delay --
    }
    else {
        if (this.pos % 2 == 0) {
        let dy = map(noise(this.x/100, this.y/100 + this.seed,frameCount/100),0,1,-0.2,0.5)
        if (this.direction == 1) {
            dy *= -1
        }
        
        
        this.y += dy
let triConstrain
if (this.pos == 0) {
triConstrain = map(this.y, this.lower,this.upper,0,gridBuffer.width/2)
}
else {
    triConstrain = map(this.y, this.lower,this.upper,gridBuffer.width/2,0)
}

     
if(this.target <= width/2) 
{
    this.x = map(this.target,0,gridBuffer.width/2,triConstrain,gridBuffer.width/2)
}
else{
    this.x = map(this.target, gridBuffer.width/2, gridBuffer.width,width/2,gridBuffer.width-triConstrain)
}

        this.y = constrain(this.y,this.upper,this.lower)

        if (this.y <= this.upper) {
            this.direction = -1
        }
        else if (Math.abs(this.y - this.lower) < 1) {
            this.direction = 1
        }
        else if (random() > 0.999) {
            this.direction *= -1
        }
    }
    else {
        let dx = map(noise(this.x/100+this.seed, this.y/100, frameCount/100),0,1,-0.2,0.5)
        const dy = map(noise(this.x/100, this.y/100 + this.seed,frameCount/100),0,1,-0.1,0.1)
        if (this.direction == -1) {
            dx *= -1
        }
        
        stroke(180)
        
        this.x += dx
        let triConstrain
        if (this.pos == 1) {
        triConstrain = map(this.x, this.lower,this.upper,0,gridBuffer.height/2)
        }
        else {
            triConstrain = map(this.x, this.lower,this.upper,gridBuffer.height/2,0)
        }
        
             
        if(this.target <= height/2) 
        {
            this.y = map(this.target,0,gridBuffer.width/2,triConstrain,gridBuffer.width/2)
        }
        else{
            this.y = map(this.target, gridBuffer.width/2, gridBuffer.width,width/2,gridBuffer.width-triConstrain)
        }
        
        


        this.x = constrain(this.x,this.lower,this.upper)
        //this.y = constrain(this.y,0,height)

        if (this.x <= this.lower) {
            this.direction = 1
        }
        else if (this.x == this.upper) {
            this.direction = -1
        }
        else if (random() > 0.999) {
            this.direction *= -1
        }
        
    }
    }
    

 }
    show() {
        //noStroke()
        noFill()
        //fill(color(240,45,58,150))
        //circle(this.x,this.y,this.r*2)
    }

}

function setup() {
    createCanvas(0.8*min(windowHeight,windowWidth),0.8*min(windowHeight,windowWidth))
    gridBuffer = createGraphics(200,200)
    gridBuffer.background(0,217,192)
    cols = gridBuffer.width / incr
    rows = gridBuffer.height / incr
    let tempArr1 = []
    for (i = 0; i<cols+1;i++) {
        let tempArr2 = []
        for (j = 0; j<rows+1;j++) {
            let contourPoint = new ContourPoint(i*incr, j*incr,incr,incr)
            tempArr2.push(contourPoint)
        
            contourPoints.push(contourPoint)
        }
        
        tempArr1.push([...tempArr2])
    }

    for (let j =0;j<rows; j++) {
        for (let i =0; i<cols; i++) {
            const cell = new ContourCell(i*incr,j*incr,incr,incr)
            
            cell.points = [
                tempArr1[i][j],
                tempArr1[i+1][j],
                tempArr1[i+1][j+1],
                tempArr1[i][j+1]
            ]
            contourCells.push(cell)
        }
}
const amount = 3

    for (let i=0; i<amount; i++) {
        blobs.push(new Blob((i+0.5)*gridBuffer.width/amount,gridBuffer.height,random(0.05,0.10)*gridBuffer.width,1,0))
    }

    
    for (let i=0; i<amount; i++) {
        blobs.push(new Blob((i+0.5)*gridBuffer.width/amount,0,random(0.05,0.1)*gridBuffer.width,-1,2))

    }
    
    for (let i=0; i<amount; i++) {
        blobs.push(new Blob(0,(i+0.5)*gridBuffer.height/amount,random(0.05,0.1)*gridBuffer.width,1,1))
    }
        

    for (let i=0; i<amount; i++) {
        blobs.push(new Blob(gridBuffer.width,(i+0.5)*gridBuffer.height/amount,random(0.05,0.1)*gridBuffer.width,-1,3))
    }
    
}

function draw() {
    gridBuffer.background(0,217,192)
    if (random() > 0.99 && voids.length < 3) {
        voids.push(new NegativeBlob(random(0, gridBuffer.width), random(0,gridBuffer.height),random(0.05, 0.2) * gridBuffer.width))
    }
    //background(255)
    for (const points of contourPoints) {
       
        points.check(blobs, voids, gridBuffer)

        
    }   

    for (const cell of contourCells) {
        //cell.check(gridBuffer)
        cell.show(gridBuffer)
    }

    image(gridBuffer,0,0,width,height)
    noFill()

    for (let blob of blobs) {
        blob.move()
        blob.show()
    }
for (let negative of voids) {
    negative.update()
}
voids = voids.filter((v) => !v.done)
    
    
    //text(round(frameRate(),0),20,20)
    
}