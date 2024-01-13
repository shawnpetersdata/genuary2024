document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.createElement('div');
    fetch('./header.html')
    .then(response => response.text())
    .then(html => {
        headerContainer.innerHTML = html;
        document.body.insertBefore(headerContainer, document.body.firstChild);
        const navBar = document.getElementById("nav")
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            navBar.classList.add('mobile-scroll');
        }
        else {
            navBar.classList.add('noMobile');
        }
    
    })

    
    const footerContainer = document.createElement('div');
    fetch('./footer.html')
    .then(response => response.text())
    .then(html => {
        footerContainer.innerHTML = html;
        document.body.appendChild(footerContainer)

        document.getElementById("yr").innerHTML = new Date().getFullYear();

    });
})
