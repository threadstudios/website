import "./styles/main.scss";

let clients = document.querySelectorAll('.clients');
if(clients.length) {
    Array.from(clients).map((cl) => {
        const items = Array.from(cl.children);
        let toLoad = items.length;
        let delay = 0;
        let imageSetters = [];
        items.map((item) => {
            const fauxImage = document.createElement('img');
            fauxImage.src = item.dataset.src;
            fauxImage.onload = () => {
                toLoad--;
                delay += .3;
                item.style.transitionDelay = `${delay}s`;
                imageSetters.push(() => {
                    item.append(fauxImage);
                    item.classList.add('active');
                })
                if (toLoad === 0) {
                    imageSetters.map(im => im());
                }
            }
        })
    });
}