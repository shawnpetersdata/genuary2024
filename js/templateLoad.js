document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.createElement('div');
    fetch('./header.html')
    .then(response => response.text())
    .then(html => {
        headerContainer.innerHTML = html;
        document.body.insertBefore(headerContainer, document.body.firstChild);
    })

    const footerContainer = document.createElement('div');
    fetch('./footer.html')
    .then(response => response.text())
    .then(html => {
        footerContainer.innerHTML = html;
        document.body.appendChild(footerContainer)

        document.getElementById("year").innerHTML = new Date().getFullYear();

    });
})
