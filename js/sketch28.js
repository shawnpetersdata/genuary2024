//brick texture: Photo by <a href="https://unsplash.com/@jakobustrop?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jakob Braun</a> on <a href="https://unsplash.com/photos/brown-and-black-brick-wall-LmGT_iY-ykc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
//paper texture: Photo by <a href="https://unsplash.com/@marjan_blan?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Marjan Blan</a> on <a href="https://unsplash.com/photos/white-textile-on-brown-wooden-table-ADfPdLBMeY8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  
  

let book
let haiku
let haikus = []
let fnt
let state = 'keyPress'
let currentLine = 0
let currentIndex = 0
let currentCharacter
let count = 0
let buffer

let typed = false
const typeSpeed = 10
const lineCool = Math.floor(typeSpeed/2)
let cooldown = 0
let keyMove = 0
let keyDirection = 1
let armLength
let visible = true
let camera

let brick
let paper


function numSyl(sentence) {
    return RiTa.analyze(sentence).stresses.split(/[\s/]+/).length
}

function checkHaiku(sentence) {
        //console.log(sentence)
        const words = RiTa.tokenize(sentence)
        let count = 0
        let line1, line2, line3
        let start, start2
        for (let i = 0; i<words.length;i++) {
            start = i
            count += numSyl(words[i])
            if (count == 5) {
                line1 = words.slice(0,i+1)
            break
            }
            else if (count > 5) {
                return
            }
        }
        count = 0
        start ++
        for (let j = start; j<words.length;j++) {
            start2 = j
            count += numSyl(words[j])
            if (count == 7) {
                line2 = words.slice(start,j+1)
            break
            }
            else if (count > 7) {
                return
            }
        
        }
        count = 0
        start2++
        for (let i = start2; i<words.length;i++) {
            count += numSyl(words[i])
            if (count == 5) {
                line3 = words.slice(start2,i+1)
            break
            }
            else if (count > 5) {
                return
            }
        }
        
        return {l1:line1,l2:line2,l3:line3}
    }
 
function splitWithPunction(arr) {
    let firstIndex = 0
    for (const word of arr.l1) {
        firstIndex = arr.sentence.indexOf(word,firstIndex)
        console.log(word,firstIndex)
    }
    firstIndex = arr.sentence.indexOf(" ", firstIndex)
    const sentence1 = arr.sentence.slice(0,firstIndex)
    let secondIndex = firstIndex
    for (const word of arr.l2) {
        secondIndex = arr.sentence.indexOf(word,secondIndex)
        console.log(word,secondIndex)
    }

    secondIndex = arr.sentence.indexOf(" ", secondIndex)
    const sentence2 = arr.sentence.slice(firstIndex+1,secondIndex)
    const sentence3 = arr.sentence.slice(secondIndex+1)

    return [sentence1, sentence2, sentence3]
    
}

function preload() {
    book = loadStrings('/resources/sherlock.txt')
    fnt = loadFont('/resources/SpecialElite-Regular.ttf')
    brick = loadImage('/resources/jakob-braun-LmGT_iY-ykc-unsplash.jpg')
    paper = loadImage('/resources/marjan-blan-ADfPdLBMeY8-unsplash.jpg')
}

function printLetter() {
    buffer.text(haiku[currentLine][currentIndex],20+currentIndex*20,height/2+currentLine*35)
    currentIndex++  
    
    if (currentIndex > haiku[currentLine].length-1) {
        currentIndex =0
        currentLine++
    }

    if(currentLine == 3) {
        state="done"
    }
    else {
        currentCharacter = haiku[currentLine][currentIndex]
    }


}

function setup() {
    RiTa.SILENT = true;
    brick.filter(BLUR,3)
    const dim = 0.8*(min(windowWidth,windowHeight))
    createCanvas(dim,dim,WEBGL)
    const bufferSize = max(800, dim)
    buffer = createGraphics(bufferSize,bufferSize)
    buffer.image(paper,0,0,buffer.width,buffer.height)
    buffer.fill('black');
    buffer.textFont(fnt);
    buffer.textSize(36);
    let fullText = join(book, ' ');

book = RiTa.sentences(fullText)
for (const sentence of book) {
    const stripped = sentence.replace(/[^\w\s]/g, '');

    if (numSyl(stripped) == 17) {
        haiku = checkHaiku(stripped)
        if (haiku) {
            haiku.sentence = sentence
            haikus.push(haiku)
        }
    }    
}

haiku = splitWithPunction(random(haikus))
console.log(haiku)

currentCharacter = haiku[currentLine][currentIndex]

armLength = height/2

camera = createCamera()

}

function draw() {
    const flicker1 = map(0.7 * sin(2*Math.PI * 0.2 * frameCount/25) + 0.3*sin(2*Math.PI*0.4*frameCount/100),-2,2,0.25,1)
    const flicker2 = map(0.7 * sin(2*Math.PI * 0.4 * frameCount/25) + 0.3*sin(2*Math.PI*0.2*frameCount/100),-2,2,0.25,1)
    pointLight(224, 157*flicker1, 55*flicker1, -0.2*width,-0.5*height,50)
    pointLight(224, 157*flicker2, 55*flicker2, 0.3*width,-0.5*height,50)
    pointLight(100,100,100, 0,-0.5*height,50)

    camera.setPosition(width/6,-height/2,700)
    push()
    ambientMaterial(0)
    texture(brick)
    noStroke()
    translate(0,-height/2,0)
    plane(width,height)
    pop()
    
    push()
    translate(width/4-currentIndex*width*0.012,-currentLine*height*0.015-height*0.2,0)
    texture(buffer)
    box(0.5*width,0.5*width,1)
    pop()
    
   if (state == "keyPress") {
    push()
    specularMaterial('gray')

    translate(width*0.01,height/6,0)
    const shift = map(noise(currentCharacter.charCodeAt(0)),0,1,-0.25,0.25)*width
    const angle = atan2(shift,armLength)
    translate(shift,0,armLength/2)
    rotateX(map(keyMove,0,1,0,-Math.PI/2))
    rotateY(angle)
    translate(0,0,-armLength/2)
    if(visible) {
        box(10,10,armLength)
    }
    pop()
    keyMove += (keyDirection * 0.1)
    if (keyDirection == 1 && keyMove >=1) {
        keyDirection = -1
        printLetter()
        
    }
    else if (keyDirection == -1 && keyMove <= 0) {
        keyDirection = 1
        if (currentCharacter == " ") {
            visible = false
        }
        else {
            visible = true
        }   
    }
   }
}


