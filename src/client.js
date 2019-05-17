import "./styles/main.scss";

let clients = document.querySelectorAll('.clients');
if(clients.length) {
    Array.from(clients).map((cl) => {
        const items = Array.from(cl.children);
        let toLoad = items.length;
        let delay = 0;
        let imageSetters = [];
        items.forEach((item) => {
            const fauxImage = document.createElement('img');
            fauxImage.src = item.dataset.src;
            delay += .15;
            item.style.transitionDelay = `${delay}s`;
            fauxImage.onload = () => {
                toLoad--;
                imageSetters.push(() => {
                    item.append(fauxImage);
                    item.classList.add('active');
                })
                if (toLoad === 0) {
                    imageSetters.forEach(im => im());
                }
            }
        })
    });
}