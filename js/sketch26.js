//Linen pattern - Photo by <a href="https://unsplash.com/@anniespratt?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Annie Spratt</a> on <a href="https://unsplash.com/photos/a-white-sheet-of-paper-with-a-brown-border-xTaOPMa6wAE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  
//Tutorials by BarneyCodes
//https://editor.p5js.org/BarneyCodes/sketches/zYE1AuET8

const rulesArr = [
    {
        "X": [
        {rule:"(F+[[X]-X]-F[-FX]+X)", prob:0.6},
        {rule:"(F+[-X]-F[-FX]+X)", prob:0.1},
        {rule:"(F+[X]-F[-FX]+X)", prob:0.1},
        {rule:"(F++[[X]-X]-F[-FX]++X)", prob:0.1},
        {rule:"(F+[[X]--X]-F[--FX]+X)", prob:0.1}
    ],
    "F": [
        {rule:"F(F)",prob:0.85},
        {rule:"F(FF)", prob:0.05},
        {rule:"F",prob:0.05},
        {rule:"FA",prob:0.025},
        {rule:"FB",prob:0.025}
    ],
    "(":[
        {rule:"", prob:1}
    ],
    ")":[
        {rule:"", prob:1}
    ]
},
{
    "X": [
      // Original rule
      { rule: "(F[+X][-X]FX)",  prob: 0.5  },
      
      // Fewer limbs
      { rule: "(F[-X]FX)",      prob: 0.05 },
      { rule: "(F[+X]FX)",      prob: 0.05 },
      
      // Extra rotation
      { rule: "(F[++X][-X]FX)", prob: 0.1  },
      { rule: "(F[+X][--X]FX)", prob: 0.1  },
      
      // Berries/fruits
      { rule: "(F[+X][-X]FXA)",  prob: 0.1  },
      { rule: "(F[+X][-X]FXB)",  prob: 0.1  }
    ],
    "F": [
      // Original rule
      { rule: "F(F)",  prob: 0.85 },
      
      // Extra growth
      { rule: "F(FF)", prob: 0.05 },
      
      // Stunted growth
      { rule: "F",   prob: 0.1 },
    ],
    "(": [{rule:"", prob:1}],
    ")": [{rule:"",prob:1}]
  },
  {"X": [{rule:"F", prob:1}],
    "F": [{rule:"F(F-[F+F+F]+[+F-F-F])",prob:0.8},
    {rule:"F(F-[F+F+F]+[+F-F])",prob:0.05},
    {rule:"F(F-[F+F]+[+F-F-F])",prob:0.05},
{rule:"FA", prob:0.05},
{rule:"FB", prob:0.05}],
    "(": [{rule:"", prob:1}],
    ")": [{rule:"",prob:1}]
}
]

let plants = []
let background
let completedCanvas


class Plant {
    
    constructor(x,y, len,angle, maxGen, growthRate) {
        
        this.rules = random(rulesArr)
        this.word = 'X'
        this.x = x
        this.y = y
        this.len = len
        this.angle = angle
        this.maxGen = maxGen
        this.currentGen = 0
        this.growthPercent = 1
        this.growthRate = growthRate
        this.done = false
        this.canvas = createGraphics(width,height)
        this.color = color(62,random(50,75),25,random(100,200))

        this.drawRules = {
            "A": (t) => {
              // Draw circle at current location
              this.canvas.noStroke();
              this.canvas.fill("#E5CEDC");
              this.canvas.circle(0, 0, len*2 * t);
            },  
            "B": (t) => {
              // Draw circle at current location
              this.canvas.noStroke();
              this.canvas.fill("#FCA17D");
              this.canvas.circle(0, 0, len*2 * t);
            },
            "F": (t) => {
              // Draw line forward, then move to end of line
              this.canvas.stroke(this.color);
              this.canvas.line(0, 0, 0, -len * t);
              this.canvas.translate(0, -len * t);
            },
            "+": (t) => {
              // Rotate right
              this.canvas.rotate(-ang);
            },
            "-": (t) => {
              // Rotate right
              this.canvas.rotate(ang);
            },
            // Save current location
            "[": this.canvas.push,
            // Restore last location
            "]": this.canvas.pop,
          };

    }
    drawSystem() {
        let t = constrain(this.growthPercent,0,1)
        let lerpOn = false
    
        this.canvas.push()
        this.canvas.translate(this.x,this.y)
        this.canvas.rotate(-this.angle)
        for (let c of this.word) {
    
            if (c === "(") {
                lerpOn = true
                continue
            }
            else if (c === ")") {
                lerpOn = false
                continue
            }
            let lerpT = t
            if (!lerpOn) {
                lerpT = 1
            }
            if (c in this.drawRules) {
    
                this.drawRules[c](lerpT)
            }
        }
        this.canvas.pop()
    }
    generate() {
        let next = ""
        
        for (let c of this.word) {
            if (c in this.rules) {
                let rule = this.rules[c]
                next += this.randomRule(rule)
            }
            else {
                next += c
            }
        }
        this.word = next
    }
    nextGen() {
        if (this.growthPercent < 1) {
            return
        }
    
        if (this.currentGen === this.maxGen) {
            this.done = true
        }
        else {
            this.generate()
            this.currentGen ++
            this.growthPercent = 0
        }
    }
    randomRule(ruleSet) {
        let n = random()
        let t = 0
        for (let i = 0; i<ruleSet.length;i++) {
            t+=ruleSet[i].prob
            if (t>=n) {
                return ruleSet[i].rule
            }
        }
        return ""
    }
    update() {
        if (!this.done) {
            this.canvas.clear()
            if (this.growthPercent < 1) {
                const mod = (this.currentGen + this.growthPercent)
                this.growthPercent += this.growthRate/mod
            }
            else{
                this.nextGen()
            }
            this.drawSystem()
        }
        image(this.canvas,0,0)
    }
}




let len
const angle = 0
const ang = Math.PI/9

let cooldown = 100

function preload() {
    bg = loadImage('/resources/annie-spratt-xTaOPMa6wAE-unsplash.jpg')
}

function setup() {
   
    const dim = 0.8*min(windowWidth, windowHeight)
    createCanvas(0.8*windowWidth,0.8*windowHeight)
    completedCanvas = createGraphics(width,height)

    console.log(bg.width, bg.height)
    console.log(width, height)

    len = height/150
    
    
    plants.push(new Plant(width/2, height, len,0,Math.floor(random(4,6)),random(0.05)))

}

function draw() {
    image(bg,0,0)
    image(completedCanvas,0,0)
    if (random() > 0.99 && cooldown <= 0 && frameRate() > 30) {
        plants.push(new Plant(random(width), height, random(0.5,1.5)*len,random(-0.5,0.5),Math.floor(random(4,6)),random(0.05)))
        cooldown = 100
    }
    for (const plant of plants) {
        plant.update()
    }

    const completed = plants.filter((plant)=>{return plant.done})

    if (completed.length != 0) {
        for (const plant of completed) {
            completedCanvas.image(plant.canvas,0,0)
        }
        plants = plants.filter((plant) => {return !plant.done})
    }


    cooldown--
    
}







