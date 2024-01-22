const points = []
const lines = []
const planes = []
let palette
const brushes = brush.box()

class kPlane {
    constructor(x1,y1,x2,y2,x3,y3,x4,y4,colour) {
        this.arr = [
            [x1,y1],
            [x2,y2],
            [x3,y3],
            [x4,y4]
        ]
        this.color = colour
        this.seed = random(10000)
    }
    show() {
        randomSeed(this.seed)
        brush.set('watercolor',...this.color,255)
        brush.fill(...this.color,200)
        brush.noField()
        brush.polygon(this.arr)
        
    }
}

class kPoint {
    constructor (x,y,r,layers, palette,colour) {
        this.x = x
        this.y = y
        this.r = r
        this.seed = random(10000)
        this.body = new Particle(x,y)
        this.body.lock()
        this.palette = palette
        this.layers = layers
        const pointVec = new toxi.geom.Vec2D(x,y);
    
     
    this.attractor = new toxi.physics2d.behaviors.AttractionBehavior(pointVec, this.r*5, 0.25);
    physics.addBehavior(this.attractor)
    this.repulsor = new toxi.physics2d.behaviors.AttractionBehavior(pointVec, this.r*1.25, -5);
    physics.addBehavior(this.repulsor)

    }
    intersects(arr) {
        for (const other of arr) {
            if (other === this) {
                continue
            }
            if (dist(this.x,this.y,other.x,other.y) < this.r + other.r) {
                return true
            }    
        }
        return false
    }
    show() {
        
        let r = this.r
        for (let i = 0; i<this.palette.length; i++) {
        randomSeed(this.seed)
        brush.set('watercolor',...this.palette[i],255)
        brush.fill(...this.palette[i],180)
        brush.noField()

        brush.bleed(0.2,0)
        brush.fillTexture(0.7,0.4)
        brush.circle(this.x,this.y,r,1,false)
        r*=0.75
            }
            
        }
}

class kLine {
    constructor(x1,y1,x2,y2,colour) {
        this.points1 = []
        this.points2 = []
        this.springs = []
        this.x1=x1
        this.y1=y1
        this.x2=x2
        this.y2=y2
        this.color = colour
        const arrs = [this.points1, this.points2]
        const angle = atan2(y2-y1,x2-x1)
        for (let j = 0; j<=1; j++){
            if (j == 1) {
                x1 += random(10,20)*Math.cos(angle)
                y1 += random(10,20)*Math.sin(angle)
            }

        for (let i = 0; i<1;i+=0.05) {
            let temp = new Particle(lerp(x1,x1+x2,i),lerp(y1,y1+y2,i))
            physics.addParticle(temp)

            arrs[j].push(temp)
        }
    }
        
    for (let j = 0; j<=1; j++){
        for (let i = 0;i<this.points1.length-1;i++) {
            let temp = new Spring(arrs[j][i], arrs[j][i+1],dist(arrs[j][i].x, arrs[j][i].y,arrs[j][i+1].x,arrs[j][i+1].y),0.5)
            this.springs.push(temp)
            physics.addSpring(temp)
        }
    }
        for (let i = 0; i<this.points1.length;i+=2) {
            let temp = new Spring(arrs[0][i],arrs[1][i],dist(arrs[0][i].x,arrs[0][i].y,arrs[1][i].x,arrs[1][i].y),1)
            this.springs.push(temp)
            physics.addSpring(temp)
        }
        this.points = this.points1.concat(this.points2.reverse())

        this.pointsArr = []
        for (let i = 0; i<this.points1.length;i++) {
            this.pointsArr.push([(this.points1.x + this.points2.x/2) , (this.points1.y + this.points2.y/2)
            ])
        }

        

        this.points1[0].lock()
        this.points2[0].lock()


    }
    show() {
        for (const pnt of this.points) {
            circle(pnt.x, pnt.y, 1)
        }

        
        for (const spring of this.springs) {
           
        }
        
        randomSeed(this.seed)
        brush.set('marker')
        brush.stroke(...this.color,10)
        brush.strokeWeight(1)
        for (let i = 0;i<this.points.length-1;i++) {
        brush.line(this.points[i].x,this.points[i].y,this.points[i+1].x,this.points[i+1].y)
        }

    }
}

class Particle extends toxi.physics2d.VerletParticle2D {
    constructor(x,y) {
        super(x,y)
    }
    show() {
        circle(this.x,this.y,5)
    }
}

class Spring extends toxi.physics2d.VerletSpring2D {
    constructor(p1,p2, len, k = 0.999) {
        super(p1,p2, len, k)
        this.p1 = p1
        this.p2 = p2
    }

    show() {
        stroke(0)
        strokeWeight(1)
        line(this.p1.x,this.p1.y,this.p2.x,this.p2.y)
    }
}

function setup() {
    const dim = 0.8*min(windowWidth, windowHeight)
    createCanvas(dim,dim,WEBGL)
    //brush from p5.brush Example https://editor.p5js.org/acamposuribe/sketches/nuRfjaDgc
    brush.add("watercolor", {
        type: "custom",
        weight: 5,
        vibration: 0.1,
        definition: 0.5,
        quality: 8,
        opacity: 5,
        spacing: 0.3,
        blend: true,
        pressure: {
            type: "standard",
            curve: [0.15, 0.2],
            min_max: [0.9, 1.1]
        },
        tip: function () {
            rect(-5, -5, 10, 10);
            rect(5, 5, 4, 4);
        },
        rotate: "natural"
    });

    brush.pick("watercolor")

    palette = [
        [192,154,54],
        [101,116,73],
        [136,44,40],
        [177,168,141],
        [75,55,60],
        [127,156,165],
        [63,85,52],
        [62,97,83],
        [112,109,120],
        [130,107,108],
        [191,199,188],
        [188,183,174],
        [19,57,133],
        [255,205,85],
        [145,104,40],
        [155,159,172],
        [106,63,85]
      ];
        shuffle(palette, true);
        bg = palette.pop();

        
        


    physics = new toxi.physics2d.VerletPhysics2D()


    for (let i = 0; i<Math.floor(random(2,8)); i++) {
        const r = width*random(0.05,0.15)
        const x = random(-width/2+r,width/2-r)
        const y = random(-height/2+r,height/2-r)
        const layers = Math.floor(random(0,2)) * Math.floor(random(1,5)) + 1
        let ripplePal = []
        for (let i = 0; i<layers;i++) {ripplePal.push(random(palette))}
        const temp = new kPoint(x,y,r,layers, ripplePal)
        if (!temp.intersects(points)) {
            points.push(temp)
        } 
        
    }

    for (let i = 0;i<Math.floor(random(2,8));i++) {

        const x1 = random(-width/2,width/2)
        const y1 = random(-height/2,height/2)
        let valid = true
        for (const pnt of points) {
            if( dist(pnt.x,pnt.y,x1,y1) < pnt.r) {
                valid = false
            }        
        }
        if (valid) {
        lines.push(new kLine(x1,y1,random(width),random(height),random(palette)))
    }
    }

    for (let i = 0;i<Math.floor(random(2,8));i++) {
        
        const pointArr = []
        const r = random(0.1,0.5) * width
        const x0 = random(-width/2+r,width/2-r)
        const y0 = random (-height/2+r,height/2-r)
        const start = random(2*Math.PI)
        let valid = true
        
        for (let j = 0; j<4;j++) {
            let x = x0+r*Math.cos(start+Math.PI/2*j+random(-1,1)*Math.PI/32)
            let y = y0+r*Math.sin(start+Math.PI/2*j+random(-1,1)*Math.PI/32)
            pointArr.push(x)
            pointArr.push(y)
            for (const pnt of points) {
                if(dist(pnt.x,pnt.y,x,y) < pnt.r) {
                    valid = false
                }
            }
            for (const ln of lines) {
                for (const pnt of ln.points) {
                    if(dist(pnt.x,pnt.y,x,y) < 10) {
                        valid = false
                    }   
                }
            }

        }
        if (valid) {
            planes.push(new kPlane(...pointArr,random(palette)))
        }
    }

    for (let i = 0; i<1000; i++) {
        physics.update()

    }
}



function draw() {
    
    noLoop()
    push()
    noStroke()
    noFill()
    brush.noField()
    brush.set('watercolor',...bg)
    brush.fill(...bg,120)

    brush.rect(-width,-height,width*2,height*2)
    

    physics.update()

    for (let kPlane of planes) {
        kPlane.show()
    }

    for (let kPoint of points) {
        kPoint.show()
        
    }
    for (let ln of lines) {
        ln.show()
    }
    
  pop()
}