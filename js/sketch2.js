let main
let brightness
let saturation
let seedVal

const wave = (loops) => {
    const inverse = Math.random() > 0.5
    noiseSeed(seedVal)
    strokeWeight(random(1,5))
    const xPoints = []
    const yPoints = []
    const modSat = saturation + random(-5,5)
    const modBright = brightness + random(-5,5)
    
    for(let x = 0.1*width;x<0.9*width;x+=25) {
        xPoints.push(x)
        if (inverse) {
            stroke((main+180)%360, modSat,modBright,10)
            yPoints.push(map(noise(x/50),0,1,0.75,0.25) * height)
        }
        else {
            stroke((main+180+30)%360, modSat,modBright,10)
            yPoints.push(map(noise(x/50),0,1,0.25,0.75) * height)
        }   
    }

    
    for (let loop = 0; loop < loops; loop ++) {
        const amp = map(loop, 0,loops,height*0.001,height*0.01)
        for (let i = 0; i<yPoints.length; i++) {
            const a = 20
            const adjust = 0.5*Math.abs(loops / (1 + Math.exp(-a * (i - loops/2))) - loops / (1 + Math.exp(loops)))
            yPoints[i] += map(noise(xPoints[i]/10, yPoints[i]/10, loop/10),0,1,-1*amp,amp) * adjust
        }    
    }
    
    beginShape()
    for (let i = 0; i<xPoints.length;i++) {
        vertex(xPoints[i],constrain(yPoints[i],0,height))
    }
    endShape()

}

function setup() {
    createCanvas(min(windowWidth,windowHeight * 0.8), min(windowWidth,windowHeight *0.8));
    colorMode(HSB)
    main = random(0,360)
    saturation = random(40,100)
    brightness = random(60,80)
    seedVal = random(10000)
    background(main,saturation,brightness)

}

function draw() {
    if (frameCount == 50) {
        noLoop()
    }
    noFill()
   
    strokeWeight(1)
    wave(frameCount)

}