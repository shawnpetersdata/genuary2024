/*
Basic geometry formed with reference to Zellige shapes study by Sandy Kurt www.sandykurt.com
*/

let constructions = []
let verts = {}
let tile1, tile2
let scl
let palettes
let palette
let bg
let strokeColor

const smallHelper = [
    ['k','o','c','i','a'],
    ['n','r','c','j','a'],
    ['l','q','b','j','a'],
    ['m','p','b','i','a']   
]
const largeHelper = [
    ['s','t', 'o','c','i','a'],
    ['z','y', 'r','c','j','a'],
    ['w','x', 'q','b','j','a'],
    ['v','u', 'p','b','i','a'],

]


class Circle {
    constructor(x,y,r, important = true) {
        this.cx = x
        this.cy = y
        this.r = r
        this.important = important
    }
    show() {
        if (this.important) {
            stroke(0,100)
        }
        else {
            stroke(0,20)
        }
        circle(this.cx, this.cy, this.r*2)
    }
}

class Line {
    constructor(x1,y1,x2,y2) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }
    show() {
        stroke(0,100)
        line(this.x1, this.y1, this.x2,this.y2)
    }
}

function setupVerts(scl) {
    //center circle
    //verts.a = {x:width/2,y:height/2}
    verts.a = {x:scl*(1+2**0.5/2), y:scl*(1+2**0.5/2),id:'a'} 
    constructions.push(new Circle(verts.a.x, verts.a.y,scl))
    constructions.push(new Line(0,verts.a.y,width,verts.a.y))
    let points = lcIntersect(constructions[1],constructions[0])

    verts.b = points[0]
    verts.b.id = 'b'
    verts.c = points[1]
    verts.c.id = 'c'



    //side circle
    constructions.push(new Circle(points[0].x, points[0].y,scl))
    constructions.push(new Circle(points[1].x, points[1].y,scl))


    let points2 = ccIntersection(constructions[0],constructions[2])

    verts.g = points2[0]
    verts.g.id = 'g'
    verts.e = points2[1]
    verts.e.id = 'e'

    points2 = ccIntersection(constructions[0],constructions[3])
    verts.d = points2[0]
    verts.d.id = 'd'
    verts.f = points2[1]
    verts.f.id = 'f'

    //larger circles
    constructions.push(new Circle(points[0].x,points[0].y,3*scl, false))
    constructions.push(new Circle(points[1].x,points[1].y,3*scl,false))
    
    points = ccIntersection(constructions[constructions.length-1], constructions[constructions.length-2])
    
    constructions.push(new Line(points[0].x,points[0].y,points[1].x,points[1].y))

    points = lcIntersect(constructions[constructions.length-1],constructions[0])
    
    verts.i = points[0]
    verts.i.id = 'i'
    verts.j = points[1]
    verts.j.id = 'j'

    constructions.push(new Circle(points[0].x,points[0].y,scl))
    constructions.push(new Circle(points[1].x,points[1].y,scl))

    
    points = ccIntersection(constructions[3],constructions[7])
    verts.k = points[1]
    verts.k.id = 'k'
    
    points = ccIntersection(constructions[3],constructions[8])
    verts.n = points[0]
    verts.n.id = 'n'

    points = ccIntersection(constructions[2],constructions[8])
    verts.l = points[1]
    verts.l.id = 'l'

    points = ccIntersection(constructions[2],constructions[7])
    verts.m = points[0]
    verts.m.id = 'm'

    constructions.push(new Line(verts.k.x,verts.k.y,verts.l.x,verts.l.y))

    points = lcIntersect(constructions[constructions.length-1],constructions[0])
    verts.q = points[0]
    verts.q.id = 'q'
    verts.o = points[1]
    verts.o.id = 'o'
    
    constructions.push(new Line(verts.n.x,verts.n.y,verts.m.x,verts.m.y))
    points = lcIntersect(constructions[constructions.length-1],constructions[0])
    verts.p = points[0]
    verts.p.id = 'p'
    verts.r = points[1]
    verts.r.id = 'r'
    
    let temp = new Line(verts.o.x, verts.o.y,verts.p.x,verts.p.y)
    points = lcIntersect(temp,constructions[3])
    verts.s = points[1]
    verts.s.id = 's'
    points = lcIntersect(temp,constructions[2])
    verts.v = points[0]
    verts.v.id = 'v'
    
    temp = new Line(verts.r.x, verts.r.y,verts.q.x,verts.q.y)
    points = lcIntersect(temp,constructions[3])
    verts.z = points[1]
    verts.z.id = 'z'
    points = lcIntersect(temp,constructions[2])
    verts.w = points[0]
    verts.w.id = 'w'
    
    temp = new Line(verts.r.x, verts.r.y,verts.o.x,verts.o.y)
    points = lcIntersect(temp,constructions[7])
    verts.t= points[0]
    verts.t.id = 't'


    points = lcIntersect(temp,constructions[8])
    verts.y = points[1]
    verts.y.id = 'y'
    
    temp = new Line(verts.p.x, verts.p.y,verts.q.x,verts.q.y)
    points = lcIntersect(temp,constructions[7])
    verts.u= points[1]
    verts.u.id = 'u'

    
    points = lcIntersect(temp,constructions[8])
    verts.x = points[0]
    verts.x.id = 'x'
    return verts
}

function ccIntersection(circ1,circ2) {
    const { cx: cx1, cy: cy1, r: r1 } = circ1;
    const { cx: cx2, cy: cy2, r: r2 } = circ2


    //cx1, cy1, r1, cx2, cy2, r2
    // Calculate the distance between the centers of the circles
    const d = Math.sqrt((cx2 - cx1) ** 2 + (cy2 - cy1) ** 2);

    // Check if the circles are too far apart or if one is contained within the other
    if (d > r1 + r2 || d < Math.abs(r1 - r2)) {
        return []; // No intersection points
    }

    // Calculate the intersection angle between the line connecting the centers and the x-axis
    const theta = Math.atan2(cy2 - cy1, cx2 - cx1);

    // Calculate the angles at which the intersection points occur
    const alpha = Math.acos((r1 ** 2 + d ** 2 - r2 ** 2) / (2 * r1 * d));
    const beta = Math.acos((r2 ** 2 + d ** 2 - r1 ** 2) / (2 * r2 * d));

    // Calculate the coordinates of the intersection points
    const intersection1 = {
        x: cx1 + r1 * Math.cos(theta + alpha),
        y: cy1 + r1 * Math.sin(theta + alpha)
    };

    const intersection2 = {
        x: cx1 + r1 * Math.cos(theta - alpha),
        y: cy1 + r1 * Math.sin(theta - alpha)
    };

    return [intersection1, intersection2];
}

function lcIntersect(ln, circ) {
    
    const {x1,y1,x2,y2} = ln
    const {cx,cy,r} = circ

    //x1, y1, x2, y2, cx, cy, r


    // Calculate the direction vector of the line
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Calculate the vector from the circle center to the line start
    const ex = x1 - cx;
    const ey = y1 - cy;

    // Calculate the coefficients for the quadratic equation
    const a = dx * dx + dy * dy;
    const b = 2 * (dx * ex + dy * ey);
    const c = ex * ex + ey * ey - r * r;

    // Calculate the discriminant
    const discriminant = b * b - 4 * a * c;

    // Check if there are real solutions (intersection points)
    if (discriminant < 0) {
        return []; // No intersection points
    }

    // Calculate the two possible solutions for t (parameter along the line)
    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    // Calculate the intersection points
    const intersection1 = { x: x1 + t1 * dx, y: y1 + t1 * dy };
    const intersection2 = { x: x1 + t2 * dx, y: y1 + t2 * dy };
    
    return [intersection1, intersection2];
}

function notAdjacent(arr,val1,val2) {
    
    if (Math.abs(arr.indexOf(val1)-arr.indexOf(val2)) == 1) {
        return false
    }
    else if (arr.indexOf(val1) == 0 && arr.indexOf(val2) == arr.length-1){
        return false
    }
    else if (arr.indexOf(val2) == 0 && arr.indexOf(val1) == arr.length-1){
        return false
    }
    
    return true
}
function verifiedShuffle(arr, end) {
    const tester = largeHelper[0]
    valid = false
    while (valid == false) {
        shuffle(arr,true)
        //something not working
        if(
            notAdjacent(arr.slice(0,end+1),0,1) &&
            notAdjacent(arr.slice(0,end+1),0,4) &&
            notAdjacent(arr.slice(0,end+1),1,3)
        )
        {
            valid = true
        }
        else {
        }
    }
    return arr
} 

function tile(buffer,helper,limit) {
    let shape = Array.from({ length: helper[0].length }, (_, index) => index);
    
    const amount = random(2,4)
    //const amount = 1
    for (let k = 0; k<amount; k++){
        let len = random(3,5)
        if (limit) {        
            shape = verifiedShuffle(shape,len)
        }
        else {
            shuffle(shape,true)
        }
    
    
    buffer.fill(random(palette))
    for (let i =0; i<4; i++) {
        const piece = helper[i]
        
        buffer.beginShape()
        for (let j = 0;j<len;j++) {
           
            buffer.vertex(verts[piece[shape[j]]].x,verts[piece[shape[j]]].y)
        }
        buffer.endShape(CLOSE)
    }}
}

function setup() {
    palettes = [
        [color(252,250,254), color(9,27,103), color(99,196,231), color(213,124,26), color(234,221,199)],
        [color(213,177,46), color(254,220,210), color(52,85,61), color(166,46,57), color(45,34,37)],
        [color(255,255,255), color(187,4,43), color(255,165,0), color(0,53,101), color(2,155,72),  color(255,153,203)]
    ]
    palette = random(palettes)
    shuffle(palette,true)
    bg = palette.pop()
    strokeColor = palette.pop()
    scl = width/5
    const sz = 0.8 * min(windowWidth, windowHeight)
    createCanvas(sz,sz)
    //randomSeed(1)
    stroke(0,100)
    noFill()
    
    verts = setupVerts(scl)
    const dim = 2*scl+scl*2**0.5
    tile1 = createGraphics(dim,dim)
    //tile2 = createGraphics(scl*2**0.5,scl*2**0.5)

tile2 = createGraphics(dim,dim)

    /*
    

    

    

    line(points[0].x,points[0].y,points[1].x,points[1].y)

*/
}

function draw() {
    noLoop()
    background(bg)

    imageMode(CENTER)
    tile1.strokeWeight(scl/10)
    tile1.stroke(strokeColor)
    tile2.strokeWeight(scl/10)
    tile2.stroke(strokeColor)
    
    tile(tile1,largeHelper,true)
    tile(tile2,smallHelper,false)

    translate(width/2,height/2)
    rotate(Math.floor(random(-1,1))*Math.PI/4)
    let incr = scl*3.5

    for (let i = -10; i<=10;i++) {
        for (let j = -10; j<=10;j++) {
            image(tile2,i*incr,j*incr)
        }
    }
    for (let i = -10; i<=10;i++) {
        for (let j = -10; j<=10;j++) {
            image(tile1,-1.75*scl+i*incr,-1.75*scl+j*incr)
        }
    }
    


    /*
    image(tile1,0,0)
    image(tile1,verts.s.x+2*scl+scl*2**0.5,0)
    image(tile1,verts.s.x,+2*scl+scl*2**0.5)
    image(tile1,verts.s.x+2*scl+scl*2**0.5,+2*scl+scl*2**0.5)
    
    image(tile2,3**0.5*scl,3**0.5*scl)
    
*/
    //tile1.background(240)
    //tile1.line(verts.s.x,verts.s.y,verts.v.x,verts.v.y)
    //tile1.line(verts.z.x,verts.z.y,verts.w.x,verts.w.y)

    //tile1.background(220)
    
    //tile(tile1,largeHelper)
    
    //image(tile1,0,0)
    
    //verifiedShuffle([0,1,2,3,4,5,6])
    
    


    //['s','t', 'o','c','i','a']
    
    /*
    notAdjacent(arr,0,1) &&
    notAdjacent(arr,0,4) &&
    notAdjacent(arr,1,3)
    */
    
    //strokeWeight(2)
    //line(verts.i.x,verts.i.y,verts.t.x,verts.t.y)
    
    /*
    for (const constructor of constructions) {
        constructor.show()
    }
    */
    

}