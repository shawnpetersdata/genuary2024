//Photo by <a href="https://unsplash.com/@johangifts?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Pei Yu</a> on <a href="https://unsplash.com/photos/a-group-of-houses-sitting-on-a-pier-next-to-a-body-of-water-_Av4Cdyo3kg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
let baseImg
let w,h
let allPixels = []
let state = 'changing'
let r = 0
let g = 0
let b = 0
let pixelInfo
let pixelDict = {}
let colors = []
const incr = 1
let canvas
let totalColors
let totalPixels
let count
let barFill
let fillPattern

function preload() {
    baseImg = loadImage("./resources/pei-yu-_Av4Cdyo3kg-unsplash.jpg")
}

function getPixelInfo(arr) {
    let new_dict = {}
    for (let i = 0; i<arr.length; i+=4) {
                
        if (new_dict.hasOwnProperty([arr[i],arr[i+1], arr[i+2]])) {
            new_dict[[arr[i],arr[i+1], arr[i+2]]].push({x:(i/4) % baseImg.width,y:Math.floor((i/4)/baseImg.width)})
        }
        else {
            new_dict[[arr[i],arr[i+1], arr[i+2]]] = [{x:(i/4) % baseImg.width,y:Math.floor((i/4)/baseImg.width)}]
        }
        
    }
    return new_dict
}

function setup() {
    count = 0
    pixelDensity(1)
    let scl
    if (windowWidth / baseImg.width < windowHeight / baseImg.height) {
        scl = 0.8*windowWidth / baseImg.width
    }
    else {
        scl = 0.8*windowHeight / baseImg.height}
    console.log(windowWidth, baseImg.width, windowWidth/ baseImg.width)
    console.log(windowHeight, baseImg.height, windowHeight/ baseImg.height)
    //scl = 0.8*min(windowWidth/baseImg.width,windowWidth/baseImg.width)
    w = scl*baseImg.width
    h = scl*baseImg.height
    console.log(w,h)
    fillPattern = createGraphics(0.1 * w, h)
    fillPattern.pixelDensity(1)
    fillPattern.background('purple')
    
    createCanvas(w,h)
    canvas = createGraphics(0.9*w, 0.9*h)
    baseImg.resize(0.9*w,0.9*h)
    baseImg.loadPixels()
    totalPixels = baseImg.pixels.length/4
    //totalPixels = 0.9*w*0.9*h
    background(255)

    pixelDict = getPixelInfo(baseImg.pixels)
    
    for (let key in pixelDict) {
        colors.push(key)

    }
    totalColors = colors.length

}

function draw() {
    background(255)
    //loop set to 1 for long form
    for (let i = 0; i<1; i++) {
        if(state == 'changing') {
            new_color = colors.pop()
            pixelInfo = pixelDict[new_color]
            const temp = new_color.split(',')
            r = int(temp[0])
            g = int(temp[1])
            b = int(temp[2])
            canvas.stroke(r,g,b)
            state = 'loading'
        }
        if(state == 'loading') {
           
            if (pixelInfo.length == 0) {
                if (colors.length == 0) {
                    state = 'done'
                }
                else {
                    state = 'changing'
                }
            }
            else {
                const pixel = pixelInfo.pop()
                canvas.point(pixel.x,pixel.y)
                count ++
                
            }
        }
        if (state == "done") {
            noLoop()
            console.log('done')
        }
    }
    image(canvas,0,0)
    noStroke()
    fill('red')
    //rect(0,0.925*h,0.9*w,0.05*h,10,10,10,10)
    //pixels complete
    fillPattern.background(61,84,95)
    for (let i = (frameCount/5)%40; i<h; i+=20) {
        fillPattern.strokeWeight(10)
        fillPattern.stroke(228,241,253)
        fillPattern.line(0,i-30,0.1*w,i)
    }

    let pattern = drawingContext.createPattern(fillPattern.elt, 'repeat')
    drawingContext.save()
    drawingContext.fillStyle = pattern


    const pixelDone = count / totalPixels*0.9*h
    rect(0.925*w,0.9*h-pixelDone,0.05*w,pixelDone,10,10,10,10)

    drawingContext.restore()


    const mod = state=="done"?0:1
    if ((frameCount - 1) % 10 == 0) {
        barFill = color(r,g,b)
    }
    fill(barFill)

    const colorPercent = (totalColors - colors.length + mod) / totalColors
    const colorsDone = colorPercent *0.9*w
    rect(0,0.925*h,colorsDone,0.05*h,10,10,10,10)
    noFill()
    stroke('white')
    strokeWeight(3)
    rect(0.925*w,0,0.05*w,0.9*h)
    rect(0,0.925*h,0.9*w,0.05*h)
    stroke('black')
    strokeWeight(2)
    rect(0.925*w,0,0.05*w,0.9*h,10,10,10,10)

    rect(0,0.925*h,0.9*w,0.05*h,10,10,10,10)
    
    stroke('white')
    fill('black')
    textSize(20)
    text(`colors loading: ${Math.floor(colorPercent * 100)} %`,0.05*w,0.95*h)
    push()
    
    translate(0.96*w,0.85*h)
    rotate(-Math.PI/2)
    text(`pixels loading: ${Math.floor(100*count / totalPixels)} %`,0,0)
    pop()

    //image(fillPattern,0,0)

}