//Photo by <a href="https://unsplash.com/@tinaflour?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Kristina Flour</a> on <a href="https://unsplash.com/photos/grayscale-photo-of-woman-doing-silent-hand-sign-BcjdbyKWquw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  

//Terminus TTF used under SIL Open Font License, version 1.1 - https://files.ax86.net/terminus-ttf/
let baseImg
let characters = []
let font
let buffer
let compression

//const orderedChar =  "`.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@"
const orderedChar = "$Hd089RgqBQ6DU5NbphAk4@#GKO2Z3ESf%ayP1Mult&WXYx7s]jzCnVT[eiowmJFr{LIcv})(?>!<+*=/^|~-;':`_,."


class ASCII {
    constructor(x,y, r =1) {
        this.x = x
        this.y = y
        this.r = r
        this.growing = true
        this.off = random(10000)
    }
    collision(others, edges) {

        if (this.x - this.r < 0 ||
            this.x + this.r > width ||
            this.y - this.r < 0 ||
            this.y + this.r > height) {
            return true
        }

        

        for (let other of others) {
            if (other === this) {
                continue
            }
            if (dist(other.x,other.y,this.x,this.y) < this.r + other.r) {
                return true
            }
        }

        for (let edge of edges) {
            if(dist(edge.x, edge.y, this.x, this.y) < this.r + 1) {
                return true
            }
        }

        return false
    }
    grow(r) {
        this.r +=0.5
    }
    assignColor(imgData) {
        this.color = baseImg.get(this.x,this.y)
        const luma = 0.2126*this.color[0] + 0.7152*this.color[1] + 0.0722*this.color[2]
        let index = map(luma, 0,255,0,orderedChar.length-1)
        index += map(noise(this.x, this.y),0,1,-3,3)
        
        index = Math.floor(constrain(index, 0, orderedChar.length))
        this.fontSize = 0.5
        this.character = orderedChar[index]
        for (let i = 1; i<100; i++) {
            buffer.textSize(i)
            buffer.textAlign(CENTER)
            if (buffer.textWidth('@') > this.r*16) {
                this.fontSize = i
                break
            } 
        }
    }
    show() {
        /*
        fill(this.color)

        textSize(this.fontSize + map(noise(frameCount/100 + this.off),0,1,-2,2))
        const x = (this.x + map(noise(this.x/100 + this.off, frameCount/100 + this.off), 0,1,-0.1*this.r, 0.1*this.r))*4
        const y = (this.y + map(noise(this.y/100 + this.off, frameCount/100 + this.off), 0,1,-0.1*this.r, 0.1*this.r))*4
        text(this.character,x,y)
        */
        
        
        buffer.fill(this.color)

        buffer.textSize(this.fontSize + map(noise(frameCount/100 + this.off),0,1,-2,2))
        const x = (this.x + map(noise(this.x/100 + this.off, frameCount/100 + this.off), 0,1,-0.1*this.r, 0.1*this.r)) * 10
        const y = (this.y + map(noise(this.y/100 + this.off, frameCount/100 + this.off), 0,1,-0.1*this.r, 0.1*this.r)) * 10
        buffer.text(this.character,x,y)
           
    }
}

function inArray(arr, val) {
    checker = arr.filter((element) => {return element == val})

    return checker.length != 0



    console.log(checker)
    
}

function compareColor(color1, color2, threshold = 1) {
    const rAvg = 0.5 * (color1[0] + color2[0])
    const rDiff = color2[0] - color1[0]
    const gDiff = color2[1] - color1[1]
    const bDiff = color2[2] - color1[2]

    return ((2 + rAvg/256)*rDiff**2 + 4*gDiff**2 + 2*((255-rAvg)/256)*bDiff**2)**0.5
}

/*
function regionSplit(img) {
    let stored = []
    let regions = []
    img.resize(w/4, h/4)
    img.loadPixels()
    image(img,0,0)
    for (let i = 1; i < img.width-1; i++) {
        for (let j = 1; j < img.height-1; j++) {
            const index = (i + j*img.width) * 4
            let currentPixel = [img.pixels[i], img.pixels[i+1], img.pixels[i+2]]
            let nextPixel = [img.pixels[i+4], img.pixels[i+5], img.pixels[i+6]]
            noStroke()
            if(compareColor(currentPixel, nextPixel) < 1) {
                fill(0,100)
            }
            else {
                fill(255,100)
            }
            rect(i*4,j*4,4,4)
        }
    }
}
*/
function convolve(img, matrix, factor,kernelSize) {
    img.loadPixels()
    let result = []
    for (let y = 0; y<img.height; y++) {
        for (let x=0;x<img.width;x++) {
            let redSum = 0
            let greenSum = 0
            let blueSum = 0

            for (let dy = -1 * Math.floor(kernelSize/2); dy<=Math.floor(kernelSize/2); dy++) {
                for (let dx = -1 * Math.floor(kernelSize/2); dx<=Math.floor(kernelSize/2); dx++) {
                    let pixelX = constrain(x + dx, 0, img.width-1)
                    let pixelY = constrain(y+dy, 0, img.height-1)
                    let offset = (pixelY * img.width + pixelX) * 4
                    let matrixValue = matrix[dy+Math.floor(kernelSize/2)][dx+Math.floor(kernelSize/2)]

                    redSum += img.pixels[offset] * matrixValue
                    greenSum += img.pixels[offset + 1] * matrixValue
                    blueSum += img.pixels[offset + 2] * matrixValue
                }
            }

        
            result.push(redSum*factor)
            result.push(greenSum*factor)
            result.push(blueSum*factor)
            result.push(img.pixels[(y*img.width + x) * 4 + 3])
        }
    }
    
    return result
}





function preload() {
    baseImg = loadImage('/resources/kristina-flour-BcjdbyKWquw-unsplash.jpg')
    font = loadFont('/resources/TerminusTTFWindows-4.49.3.ttf')
}

function setup(){

    const blurMatrix = [
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1]
    ]


    const blurFactor = 1/25

    const edgeMatrix = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ];
    
    const edgeFactor = 1

    pixelDensity(1)


    let scl = min((0.8*windowWidth)/baseImg.width,(0.8*windowWidth)/baseImg.width)
    w = scl*baseImg.width
    h = scl*baseImg.height
    buffer = createGraphics(baseImg.width,baseImg.height)
    baseImg.resize(baseImg.width/10,baseImg.height/10)
    createCanvas(w,h)
    
    //edgeImg = baseImg.get() //temp. delete

    buffer.textFont(font);
    
    let newPixels = convolve(baseImg, blurMatrix, blurFactor,7)
    edgeImg = baseImg.get()
    edgeImg.loadPixels()
    for (let i =0; i<newPixels.length; i+=4) {
        const gray = (newPixels[i] + newPixels[i+1]+ newPixels[i+2])/3
        edgeImg.pixels[i] = gray
        edgeImg.pixels[i+1] = gray
        edgeImg.pixels[i+2] = gray
        edgeImg.pixels[i+3] = newPixels[i+3]    
    }
        
    edgeImg.updatePixels()

    newPixels = convolve(edgeImg, edgeMatrix, edgeFactor,3)
    
    const edgePoints = []

    for (let i =0; i<newPixels.length; i+=4) {
        if (newPixels[i] > 1) {
            edgeImg.pixels[i] = newPixels[i]
            edgePoints.push({x:(i/4) % edgeImg.width, y:Math.floor((i/4) / edgeImg.width)})
        }
        else {
            edgeImg.pixels[i] = 0
        }
        
    }
    edgeImg.updatePixels()
/*    
console.log(edgePoints.length)
background(255)
noStroke()
fill(0,20)
    for (let coord of edgePoints) {
        circle(coord.x,coord.y, 5)
    } 
*/
    
    
    let coords = []
    const percent = 0.01
    for (let i = 0; i<edgeImg.width; i+=percent*edgeImg.width) {
        for (let j = 0; j<edgeImg.height; j+=percent*edgeImg.height) {
            coords.push({x:i, y:j})
        }

    }

    //image(edgeImg,0,0)
    
    shuffle(coords,true)
    let growing = characters.filter((character) =>{return character.growing})
    timeout = 0
    while ((growing.length !=0 || coords.length != 0) && timeout < 2000)
    {
        timeout ++
        console.log(growing.length,coords.length)
        for (let i = 0; i<250; i++) {
            if (coords.length == 0) {
                break
            }
            const coord = coords.pop()
            let character = new ASCII(coord.x, coord.y)
            if (!character.collision(characters,edgePoints)) {
                characters.push(character)
            }
        }
        
        for (let character of growing) {
            character.grow(max(1,0.005*width))
            if (character.collision(characters,edgePoints) 
            || character.r > 100) {
                character.growing = false
                }
            //character.growing = false
            }
        growing = characters.filter((character) =>{return character.growing})
        //growing = []

        
        
    }
    
    for (let character of characters) {
        character.assignColor(baseImg.pixels)
        
    }

    //background(255,150)
    //regionSplit(baseImg)
    
}

function draw() {
    noLoop()
    background(0)
    for (let character of characters) {
        
        character.show()
    }
    image(buffer,0,0,w,h)

}