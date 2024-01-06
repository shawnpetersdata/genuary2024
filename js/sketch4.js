let pixelW
let pixelH
let spacing
const bevel = spacing
const colorList = [356, 113, 241]

let art

let scl = 1

let rows
let cols = 0

let pixels = []
let leds = []

let artworks = []

class Pixel {
    constructor(x,y,r,g,b) {
        this.x = x
        this.y = y
        this.leds = [r,g,b]
    }
    setColor(r,g,b) {
        this.leds[0].setBrightness(r)
        this.leds[1].setBrightness(g)
        this.leds[2].setBrightness(b)
    }
}

class LED {
    constructor(x,y, color) {
        this.x = x
        this.y = y
        this.on = false
        this.color = colorList[color]
        this.brightness = 10
    }
    
    setBrightness(lum) {
        this.brightness = map(lum, 0, 100, 10, 100)
    }

    backlight() {
        colorMode(RGB)
        noStroke()
        fill(255,255,255,map(this.brightness,10,100,0,200))
        ellipse(this.x, this.y, pixelW, pixelH)
    }

    show() {
        colorMode(HSB)
        noStroke()
        fill(this.color, 95, this.brightness)
        
        rect(this.x, this.y, pixelW, pixelH, bevel)
    }
}

function drawImage(artwork, ) {
    
    artwork.loadPixels()
    for (let i = 0; i<artwork.pixels.length; i+=4) {

    const r = 100 * artwork.pixels[i] / 255
    const g = 100 * artwork.pixels[i+1] / 255
    const b = 100* artwork.pixels[i+2] / 255
    pixels[i/4].setColor(r,g,b)
    }

    for(let led of leds) {
        led.backlight()
    }
    for (let led of leds) {
        led.show()
    }

}

function preload() {
    for (let i = 0; i<10; i++) {
        artworks.push(loadImage(`./resources/tinyart${i}.jpg`))
    }
    
}

function setup() {
    
    createCanvas(0.8*min(windowWidth, windowHeight),0.8*min(windowWidth, windowHeight))
    pixelDensity(1)
    pixelW = width/196
    pixelH = 3.03*pixelW
    spacing = pixelW*1.01


    let colour = 0
    
    for (let c = 0; c<64; c++) {
        let xOffset = spacing
        for (let r = 0; r<64; r++) {
        
        const red = new LED(xOffset + r*pixelW,spacing+c*pixelH,0)
        const green = new LED(xOffset + r*pixelW + spacing,spacing+c*pixelH,1)
        const blue = new LED(xOffset + r*pixelW+2*spacing,spacing+c*pixelH,2)

        xOffset += 2* spacing

        leds.push(red)
        leds.push(blue)
        leds.push(green)
    
        pixels.push(new Pixel(r,c, red,green,blue))
    }}

    

    background(0)
    colorMode(HSB)

    
    


}

function draw() {
    frameRate(1)
    if ((frameCount - 1)%10 == 0) {
        background(0)
        art = random(artworks)
        drawImage(art)

    }
}