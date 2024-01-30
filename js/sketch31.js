function startSketch() {
    let bpm
    let delay
    let volume

    let Engine = Matter.Engine 
    let World = Matter.World
    let Bodies = Matter.Bodies
    let Runner = Matter.Runner
    let Body = Matter.Body

    let engine, world

    let balls = []
    let pegs = []
    let bounds = []
    let ground
    let xSpacing, ySpacing
    const rows = 16
    const cols = 32

    let staticGraphics, buffer

    const fftSize = 256//128//64//32
    let fft

    let synth, soundLoop;

    const musicalScales = [
        ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
        ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4'],
        ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G#4'],    ['C4', 'D4', 'E4', 'G4', 'A4'],
        ['C4', 'D#4', 'F4', 'F#4', 'G4', 'A#4'], 
        ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],    ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4'],
        ['E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4'], 
        ['B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4']  
    ]

    class roundBody {
        constructor(x,y,r, stationary = false) {
            let options = {}
            this.d = r*2
            if (stationary) {
                options.isStatic = true
            }
            else {
                options.restitution = 0.8
            }
            this.body = Bodies.circle(x,y,r, options)
            World.add(world,this.body)
        }
        isOffscreen(limit) {
            if(this.body.position.y > limit) {
                return true
            }
            return false
            
        }
        show(canvas, colour = 255) {
            const pos = this.body.position
            canvas.push()
            canvas.fill(colour)
            canvas.circle(pos.x,pos.y,this.d)
            canvas.pop()
        }
    }
    class Boundary {
        constructor(x,y,w,h) {
            const options = {isStatic:true}
            this.w = w
            this.h = h
            this.body = Bodies.rectangle(x,y,w,h,options)
            World.add(world, this.body)
        }
        show(canvas) {
            const pos = this.body.position
            canvas.push()
            canvas.translate(pos.x,pos.y)
            canvas.rect(0,0,this.w,this.h)
            canvas.pop()
        }
    }

    
    let sketch = new p5(function(p) {
        
        
    function pitchShift(note) {
        if (note == -1) {
            return note
        }
        let strLen = note.length
        let octave = parseInt(note.charAt(strLen-1))
        octave = Math.floor(p.map(p.noise(p.frameCount / 100),0,1,octave-2,octave+2))
        return note.substring(0,strLen-1)+String(octave)
    } 
    function echo(note, semitones) {
        
        let midiNote = p.midiToFreq(note);
        let shiftedNote = p.freqToMidi(midiNote * p.pow(2, semitones / 12));
        return shiftedNote;
    }

    function onSoundLoop(timeFromNow) {
        let index = Math.floor(p.noise(soundLoop.iterations/10)*noteLoops.length)
        let index2 = Math.floor(p.noise(soundLoop.iterations, index)*noteLoops[index].length)
        let currentNote = noteLoops[index][index2][soundLoop.iterations%16]
        currentNote = pitchShift(currentNote)
        if (currentNote != -1) {
            synth.play(currentNote,0.5,timeFromNow)

            let echo1 = echo(currentNote, -7);
            let echo2 = echo(currentNote, 12);
            synth.play(echo1, 0.4, 0, timeFromNow + 0.3);
            synth.play(echo2, 0.3, 0, timeFromNow + 0.6);
        }
    }

    function visualize() {
        amounts = []
        let numBars = fftSize / 2,
        barHeight = ( p.width - 1 ) / (numBars/4),
        barWidth = ( p.width - 1 ) / (numBars/4)
        barColor = null, 
        value = null
        p.colorMode(p.HSB,360,100,100,255)
        let spectrum = fft.analyze()

        for (let i = 0; i<numBars/4;i++) {
            barColor = p.color(p.map(i,0,numBars/4,0,360),100,90,180)
            p.fill(barColor)
            value = (spectrum[i]/255) * 0.4*p.height
            amounts.push(value)
            p.rect(i*barWidth,p.height,barWidth,-value)
        }
        return amounts
    }
    function getNotes() {
    
        p.shuffle(musicalScales, true)
        const sections = []
        for (let k = 0; k<8;k++) {
            const section = []
    
            for (let i = 0; i<4; i++) {
                //let durs = durations()
                
                const currentScale = musicalScales[Math.floor(p.noise(i/5)*musicalScales.length)]
                let start = Math.floor(p.random(currentScale.length))
                let measure = []
    
                //for (let j = 0; j<durs.length;j++) {
                for (let j = 0;j<16;j++) {
                    let index = (start + Math.floor(p.noise(i,j)*currentScale.length)) % currentScale.length
                    if (p.random() < 0.9) {
                    //measure.push({note:currentScale[index], dur:`${durs[j]}n`})
                    measure.push(currentScale[index])
                    }
                    else {
                    measure.push("-1")
                    }
    
                }
                section.push(measure)    
            }
            sections.push(section)
        }
        p.shuffle(sections, true)
        return sections
    }
    p.setup = function() {
    volume = new p5.Amplitude();

    engine = Engine.create()
    world = engine.world
    runner = Runner.create()
    Runner.run(runner,engine)
    bpm = Math.floor(p.random(1,3)) * 60

    noteLoops = getNotes()

    soundLoop = new p5.SoundLoop(onSoundLoop, '16n');
    synth = new p5.PolySynth();
    synth.setADSR(0.05,0.4,0.5,0.1)

    delay = new p5.Delay();
    delay.process(synth, 0.5, 0.7, 2300)

    soundLoop.start()
    soundLoop.bpm = bpm

    p.createCanvas(0.8*p.windowWidth,0.8*p.windowHeight)
    staticGraphics = p.createGraphics(p.width,p.height)
    staticGraphics.rectMode(p.CENTER)
    buffer = p.createGraphics(p.width,p.height)

    xSpacing = p.width/cols
    ySpacing = 0.5*p.height/rows

    balls.push(new roundBody(p.width/2+p.random(-1,1),0,0.25*Math.min(xSpacing, ySpacing)))

    for (let i = 0; i < cols; i++) {
        let offset
        for (let j = 0; j < rows; j++) {
            if (j % 2 == 0) {
                offset = xSpacing /2
            }
            else {
                offset = 0
                if (i == 0) {
                    continue
                }
                
            }
            let x = offset+i*xSpacing
            let y = 0.1*p.height + ySpacing*j
            pegs.push(new roundBody(x,y,0.125*Math.min(xSpacing, ySpacing),true))
            }   
        }
        ground = new Boundary(p.width/2,p.height,p.width,10)
        for (let i = 0; i<cols+1; i++) {
            const x = i * xSpacing
        bounds.push(new Boundary(x,0.8*p.height,0.125*Math.min(xSpacing, ySpacing),0.45*p.height))
        }

        for (const peg of pegs) {
            peg.show(staticGraphics)
        }
        for (const bound of bounds) {
            bound.show(staticGraphics)
            
        }

        fft = new p5.FFT(0.8, fftSize);

        
    }

    p.draw = function() {
        if (p.random() > 0.9) {
            bpm = Math.floor(p.random(1,3)) * 60
            soundLoop.bpm = bpm
        }
        if (p.frameRate() > 20 && p.frameCount % 60 == 0) {
            balls.push(new roundBody(p.random(0,p.width),0,0.25*Math.min(xSpacing, ySpacing)))
            }    


        p.background(0)
        buffer.background(0)
        
            
        for (let i = balls.length-1;i>=0;i--) {
            balls[i].show(buffer,p.map(volume.getLevel(),0,1,100,255))
            if (balls[i].isOffscreen(1.1*p.height)) {
                balls.splice(i,1)
            }
        }
        
        p.image(buffer,0,0)
        
        p.image(staticGraphics,0,0)

    
        const forces = visualize()
        for (let binNumber = 0; binNumber<forces.length; binNumber++) {
            const forceAmount = -1 * p.map(forces[binNumber],0,200,0,0.005,true) 
            const minHeight = p.height * p.map(forces[binNumber],0,200,1,0.8)
            let nearSource = balls
            .filter((ball) => {
                const x = ball.body.position.x
                const y = ball.body.position.y
                return y > minHeight &&
                x>binNumber * xSpacing &&
                x<(binNumber+1) * xSpacing
                })
                
                
            for (const active of nearSource) {
                Body.applyForce(active.body,{x:active.body.position.x,y:active.body.position.y},{x:0, y:forceAmount})
                }
    
        }
    
    


    

        
            

        
    }    

})}

document.querySelector('#startButton').addEventListener('click', function() {
    let elem = document.getElementById('startButton');
    elem.parentNode.removeChild(elem);
    startSketch();
    
})
