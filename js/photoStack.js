function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function animatePhoto(index) {
    let element = sortedElements[index];
    const storedRotation = element.dataset.rotation;
    //element.style.transform = "translateX(0px) rotate("+storedRotation+"deg)";

    let computedStyle = window.getComputedStyle(element);
    const transformMatrix = new DOMMatrix(computedStyle.getPropertyValue('transform'));
    const currentRotation = Math.atan2(transformMatrix.b, transformMatrix.a) * (180 / Math.PI);
    document.documentElement.style.setProperty('--javascriptRotation', currentRotation+'deg')
    // Move element to the right
    element.style.animation = `moveRight 1s ease-in-out forwards`;

    // Add animationend event listener for the right movement
    element.addEventListener('animationend', function rightAnimationEnd() {
    // Remove the event listener to avoid interference
        element.removeEventListener('animationend', rightAnimationEnd);
        elements.forEach(function(element, index) {
            element.style.zIndex ++
        })

        element.style.zIndex = 0
        let currentTransform = window.getComputedStyle(element).getPropertyValue('transform');
        element.style.animation = '';

        //element.style.transform = "translateX(400px) rotate("+storedRotation+"deg)";


        


        // Move element back to the left
        element.style.animation = `moveLeft 1s ease-in-out forwards`;

        // Add animationend event listener for the left movement
        element.addEventListener('animationend', function leftAnimationEnd() {
            // Remove the event listener to avoid interference
            element.removeEventListener('animationend', leftAnimationEnd);
            currentTransform = window.getComputedStyle(element).getPropertyValue('transform');
            element.style.animation = '';

            //element.style.transform = "translateX(0px) rotate("+storedRotation+"deg)";
            // Continue with the next element

            setTimeout(function () {
            animatePhoto((index + 1) % sortedElements.length);
        }, 1000);
        });
    });
    }
  
  


let elements = document.querySelectorAll('.rotated');

const indexArray = Array.from({length:elements.length},(_, index) => index + 1);
indexArray.reverse()

//shuffleArray(indexArray)
elements.forEach(function(element, index) {
    const rot = -20+Math.random()*40
    //const rot = index * 10 + 20
    //const rot = 30
    element.style.transform = `rotate(${rot}deg)`
    //elements.style.transform = "rotate(30deg)"
    element.style.zIndex = indexArray[index]
})

//fingers crossed method
//let photos = document.querySelectorAll('.rotated');

//const angleArray = Array.from({length: Math.floor(photos.length/2)}, () => -40 + Math.random() * 20)

//photos.forEach(function(element, index) {
//    const rot = angleArray[Math.floor(index / 2)];
//    element.style.transform = `rotate(${rot}deg)`;
    
//    console.log(rot);
//})
//ends here
elements = document.querySelectorAll('.polaroid')
const sortedElements = Array.from(elements).sort((b, a) => {
    const zIndexA = parseInt(a.style.zIndex);
    const zIndexB = parseInt(b.style.zIndex);
    return zIndexA - zIndexB;
});

animatePhoto(0)
