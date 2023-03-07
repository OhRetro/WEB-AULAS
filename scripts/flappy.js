var isSpecialModeOn = false;

function toggleSpecialMode() {
    isSpecialModeOn = !isSpecialModeOn;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createElement(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

class Barrier {
    constructor(reverse = false) {
        this.element = createElement("div", "barrier");
        const border = createElement("div", "border");
        const body = createElement("div", "body");
        border.classList.add(isSpecialModeOn ? "tube-image" : "tube-color");
        body.classList.add(isSpecialModeOn ? "tube-image" : "tube-color");
        this.element.appendChild(reverse ? body : border);
        this.element.appendChild(reverse ? border : body);

        this.setHeight = height => body.style.height = `${height}px`;
    }
}

class PairOfBarriers {
    constructor(height, opening, x) {
        this.element = createElement("div", "pair-of-barriers");

        this.superior = new Barrier(true);
        this.inferior = new Barrier();

        this.element.appendChild(this.superior.element);
        this.element.appendChild(this.inferior.element);

        this.chooseRandomOpening = () => {
            const heightS = Math.random() * (height - opening);
            const heightI = height - opening - heightS;
            this.superior.setHeight(heightS);
            this.inferior.setHeight(heightI);
        };

        this.getX = () => parseInt(this.element.style.left.split("px")[0]);
        this.setX = x => this.element.style.left = `${x}px`;
        this.getWidth = () => this.element.clientWidth;

        this.chooseRandomOpening();
        this.setX(x);
    }
}

class Barriers {
    constructor(numberOfBarriers, height, width, opening, space, notifierPoint) {
        this.pairs = [];
        for (var i = 0; i < numberOfBarriers; i++) {
            this.pairs.push(new PairOfBarriers(height, getRandomInt(200, opening), width + (space * i)));
        }
        const displacement = 3;
        this.animate = () => {
            this.pairs.forEach(pair => {
                pair.setX(pair.getX() - displacement);
                if (pair.getX() < -pair.getWidth()) {
                    pair.setX(pair.getX() + space * this.pairs.length);
                    pair.chooseRandomOpening();
                }

                const middle = width / 2;
                const crossedMiddle = pair.getX() + displacement >= middle
                    && pair.getX() < middle;
                if (crossedMiddle) {
                    notifierPoint();
                }
            });
        };
    }
}

class Bird {
    constructor(gameAreaHeight) {
        let flying = false;
        this.element = createElement("img", `bird${isSpecialModeOn ? " flipped-x-image stretched-image" : ""}`);
        this.element.src = isSpecialModeOn ? "./imgs/flappy_bird_special.gif" : "./imgs/flappy_bird.png";
        this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
        this.setY = y => this.element.style.bottom = `${y}px`;

        window.onkeydown = e => flying = true;
        window.onkeyup = e => flying = false;

        this.animate = () => {
            const newY = this.getY() + (flying ? 8 : -5);
            const maximumHeight = gameAreaHeight - this.element.clientHeight;

            if (newY <= 0) {
                this.setY(0);
            } else if (newY >= maximumHeight) {
                this.setY(maximumHeight);
            } else {
                this.setY(newY);
            }
        };

        this.setY(gameAreaHeight / 2);
    }
}

class Progress {
    constructor() {
        this.element = createElement("span", "progress");

        this.updatePoints = points => {
            this.element.innerHTML = points;
        };

        this.updatePoints(0);
    }
}

function isOverlapped(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
    return (horizontal && vertical)
}

function collided(bird, barriers) {
    let collided = false
    barriers.pairs.forEach(pairOfBarriers => {
        if (!collided) {
            const superior = pairOfBarriers.superior.element
            const inferior = pairOfBarriers.inferior.element
            collided = isOverlapped(bird.element, superior) || isOverlapped(bird.element, inferior)
        }
    })
}

class Game {
    constructor(gameArea) {
        gameArea.innerHTML = "";
        gameArea.className = isSpecialModeOn ? "special-bgd" : "normal-bgd";

        let points = 0;
        const width = gameArea.clientWidth;
        const height = gameArea.clientHeight;

        const progress = new Progress();
        const barriers = new Barriers(99, height, width, 300, 400, () => progress.updatePoints(points++));
        const bird = new Bird(700);

        gameArea.appendChild(bird.element);
        gameArea.appendChild(progress.element);
        barriers.pairs.forEach(pair => gameArea.appendChild(pair.element));

        this.start = () => {
            currentIntervalId = setInterval(() => {
                barriers.animate();
                bird.animate()

                if (isSpecialModeOn != lastSpecialModeValue) {
                    lastSpecialModeValue = isSpecialModeOn;
                    clearInterval(currentIntervalId);
                    new Game(gameArea).start();
                } else if (collided(bird, barriers)) {
                    clearInterval(currentIntervalId);
                }
            }, 20);
        };
    }
}

const gameArea = document.querySelector("[wm-flappy]")
var lastSpecialModeValue = isSpecialModeOn
var currentIntervalId = null
new Game(gameArea).start()