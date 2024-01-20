let fnt
let fnt2
let fntSize = 1
let baseImg
let scl, xOffset, yOffset
let holder1,holder2, mainCanvas
const character = String.fromCharCode(Math.floor(65 + Math.random()*26))
const startingChar = 500
let population = []
let palettes, palette
let bg, strokeColor

class Agent {
    constructor(w,h,chr, len,sequence) {
        this.w = w
        this.h = h
        this.chr = chr
        this.val = chr.charCodeAt(0)
        this.sequence = sequence
        if (this.sequence.length == 0) {
        for (let i =0;i<len;i++) {
            this.sequence.push(
                {x:random(w), y:random(h), size:random(0.01*fntSize,1*fntSize)}
            )
        }
    }
    }    
    score(c1,c2) {
        c2.image(c1,0,0,c2.width,c2.height)
        c2.loadPixels()
        let score = 0
        for (let x = 0; x<c2.width;x++) {
            for (let y=0; y<c2.height;y++) {
                score += (Math.abs(c2.get(x,y)[0]-baseImg.get(x,y)[0])) ** 2
            }
        }
        
        
        this.score = score
    }
    breed(partner) {
        shuffle(this.sequence,true)
        shuffle(partner.sequence,true)
        let part1 = this.sequence.slice(0,Math.floor(this.sequence.length/2))
        let part2 = partner.sequence.slice(Math.floor(partner.sequence.length/2),partner.sequence.length)
        return part1.concat(part2)
        
    }

    deletion() {
        let new_sequence = [...this.sequence]
        for (let i = 0;i<random(1,10);i++) {
            
            new_sequence.splice(Math.floor(random(new_sequence.length)),1)
        }
        return new_sequence
    }
    move() {
        let new_sequence =[...this.sequence]
        shuffle(new_sequence,true)
        for (let i = 0; i<random(1,10);i++) {
            const temp = new_sequence.pop()
            temp.x += random(-5,5)
            temp.y += random(-5,5)
            new_sequence.push(temp)    
        }
        return new_sequence
    }

    addition() {
        let new_sequence =[...this.sequence]
        for (let i = 0;i<random(1,10);i++){
             
            new_sequence.push({x:random(this.w),y:random(this.h),size:random(0.01*fntSize,1*fntSize)})
        }
        return new_sequence
    }

    show(thumbnails,final,c) {
        textSize(12)
        if (final) {
            c.stroke(0,255,0,10)
            c.fill(255,0,0,10)
        }
        else {
            c.background(255)
            c.stroke(0)
            c.fill(0)
            
            
        }
        for (const coord of this.sequence) {
            textFont(fnt2);

            c.textSize(coord.size)
            c.stroke(255,0,0,10)
            c.strokeWeight(5)
            c.fill(60,60,100,10)
            c.text(this.val,coord.x,coord.y)
        }
        if (thumbnails) {
            
        }
    }
}

function preload() {
    fnt = loadFont('/resources/TerminusTTFWindows-4.49.3.ttf')
    fnt2 = loadFont('/resources/DancingScript-VariableFont_wght.ttf')
}
function setBase(chr, canvas) {
    fntSize = 1
    let running = true
    textAlign(CENTER,CENTER)
    let bbox, startX,startY
    while (running) {
        textFont(fnt);
        textSize(fntSize)
        
        
        bbox = fnt.textBounds(chr,0,0)
        startX = Math.round(canvas.width / 2 - bbox.x - bbox.w / 2);
        startY = Math.round(canvas.height / 2 - bbox.y - bbox.h / 2);

        if (
            (startX - bbox.w / 2) < 0 ||
            (startY - bbox.h / 2) < 0 ||
            (startX + bbox.w / 2) > canvas.width ||
            (startY + bbox.h / 2) > canvas.height) {
            running = false;
        }

        else {
            fntSize +=1
        }

    }
  
    let newCanvas = createGraphics(bbox.w*2, bbox.h*2)
    newCanvas.background(255)
    newCanvas.textSize(fntSize)

    newCanvas.textAlign(CENTER,CENTER)
    let newCanvasStartX = Math.round(newCanvas.width / 2);
    let newCanvasStartY = Math.round(newCanvas.height / 2);
    newCanvas.text(chr,newCanvasStartX, newCanvasStartY)
    newCanvas.loadPixels()

    return newCanvas   
}

function setup() {
    console.log(character)
    palettes = [
        [color(0,70,67),color(12,22,24)],
        [color(82,73,72),color(87,70,123)],
        [color(12,9,13),color(224,26,79)],
        [color(85,40,111),color(33,11,44)]
    ]

    palette = random(palettes)
    shuffle(palette,true)
    bg = palette[0]
    

    baseImg = createGraphics(Math.floor(0.8*windowWidth/25),Math.floor(0.8*windowHeight/25))
    baseImg.pixelDensity(1)
    baseImg.background(255)
    baseImg = setBase(character, baseImg)

    let scl = min(0.8*windowWidth/baseImg.width,0.8*windowHeight/baseImg.height)
    
    holder1 = createGraphics(baseImg.width, baseImg.height)
    holder1.pixelDensity(1)
    holder1.background(255)
    
    pixelDensity(1)
    holder2 = createGraphics(baseImg.width*scl,baseImg.height*scl)
    const dim = max(baseImg.width*scl, baseImg.height*scl)
    mainCanvas = createCanvas(dim,dim)

    xOffset = (dim - holder2.width) / 2
    yOffset = (dim - holder2.height) / 2
    strokeColor = palette[1]
background(bg)
textFont(fnt2);

for (let i = 0; i<1000; i++) {
    strokeColor.setAlpha(random(25,40))
    stroke(strokeColor)
    fill(strokeColor)
    textSize(random(0.01*fntSize,1*fntSize))
    text(character.charCodeAt(0), random(width), random(height))
}


 console.log(xOffset, yOffset)

    holder2.pixelDensity(1)
    holder2.background(255)

    for (let i = 0; i<100;i++) {
        population.push(new Agent(holder2.width,holder2.height,character,startingChar, []))
    }

}
function draw() {
   
    baseImg.loadPixels()


console.log(frameCount)

for (const agent of population) {
    holder2.background(255)
    agent.show(false, false,holder2)
    agent.score(holder2,holder1)
}

population.sort((a, b) => parseFloat(a.score) - parseFloat(b.score));

strokeColor = palette[1]

const alp = 2  

if (frameCount == 200) {
    noLoop()
    console.log('done')
    strokeColor.setAlpha(255)
}

else {
    strokeColor.setAlpha(alp)

}

stroke(strokeColor)
fill(strokeColor)

for (const txt of population[0].sequence) {
    textSize(txt.size)
    text(population[0].val,txt.x + xOffset,txt.y + yOffset)
}

let parents = population.slice(0,10)
population = []

for (const parent of parents) {
    let sequence = [...parent.sequence]
    sequence.push(new Agent(holder2.width,holder2.height,character,startingChar,sequence))

    for (const partner of parents) {
        
        if (parent === partner) {
            continue    
        }
        let temp = new Agent(holder2.width,holder2.height,character,startingChar,parent.breed(partner))
        population.push(temp)
    }
    population.push(new Agent(holder2.width,holder2.height,character,startingChar,parent.deletion()))
    population.push(new Agent(holder2.width,holder2.height,character,startingChar,parent.addition()))
    population.push(new Agent(holder2.width,holder2.height,character,startingChar,parent.move()))
}

}