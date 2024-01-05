function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function animatePhoto(index) {
    console.log(sortedElements)
    let element = sortedElements[sortedElements.length-index-1];
    const storedRotation = element.dataset.rotation;

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

        // Move element back to the left
        element.style.animation = `moveLeft 1s ease-in-out forwards`;

        // Add animationend event listener for the left movement
        element.addEventListener('animationend', function leftAnimationEnd() {
            // Remove the event listener to avoid interference
            element.removeEventListener('animationend', leftAnimationEnd);
            currentTransform = window.getComputedStyle(element).getPropertyValue('transform');
            element.style.animation = '';

            // Continue with the next element

            setTimeout(function () {
            animatePhoto((index + 1) % sortedElements.length);
        }, 1000);
        });
    });
    }
  
let elements = document.querySelectorAll('.rotated');

let indexArray = Array.from({length:elements.length},(_, index) => index + 1);

console.log(indexArray)
indexArray.reverse()
console.log(indexArray)

elements.forEach(function(element, index) {
    const rot = -20+Math.random()*40
    
    element.style.transform = `rotate(${rot}deg)`
    element.style.zIndex = indexArray[index]
})

elements = document.querySelectorAll('.polaroid')
const sortedElements = Array.from(elements).sort((b, a) => {
    const zIndexA = parseInt(a.style.zIndex);
    const zIndexB = parseInt(b.style.zIndex);
    return zIndexA - zIndexB;
});

window.onload = animatePhoto(0)
