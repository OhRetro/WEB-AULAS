function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createElement(tagName, className = "") {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

class AudioEngine {
    constructor(audioId, audioSource, audioVolume = 1, audioLooped = false) {
        this.element = createElement("audio")
        this.element.setAttribute("id", audioId)
        this.element.setAttribute("src", audioSource)
        this.element.setAttribute("volume", audioVolume)
        audioLooped ? this.element.setAttribute("loop", "") : null;

        this.play = () => {
            this.element.play()
        }

        this.stop = () => {
            this.element.pause()
            this.element.currentTime = 0
        }

        this.remove = () => {
            this.element.remove()
        }
    }
}

function setAudioSource(audioId, source) {
    document.getElementById(audioId).setAttribute("src", source);
}

function playAudio(audioId) {
    document.getElementById(audioId).play();
}

function stopAudio(audioId) {
    var audio = document.getElementById(audioId)
    audio.pause();
    audio.currentTime = 0;
}


class Barrier {
    constructor(reverse = false) {
        this.element = createElement("div", "barrier");
        const border = createElement("div", "border tube-color");
        const body = createElement("div", "body tube-color");

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
        this.pairs = [...Array(numberOfBarriers)].map(() => 0);;
        for (var i = 0; i < numberOfBarriers; i++) {
            this.pairs[i] = new PairOfBarriers(height, getRandomInt(200, opening), width + (space * i));
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
        this.jumpSound = new AudioEngine("jump-sound", "sounds/jump.wav", "0.6")
        this.hitSound = new AudioEngine("hit-sound", "sounds/hit.wav", "0.5")
        this.dieSound = new AudioEngine("die-sound", "sounds/die.wav", "0.5")

        this.element = createElement("img", "bird");
        this.element.src = "./images/flappy_duck.png";
        this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
        this.setY = y => this.element.style.bottom = `${y}px`;

        this.velocity = 0;
        this.rotation = 0;
        this.hasJumped = false;

        document.addEventListener("keydown", event => {
            if (event.code === "Space" && !this.hasJumped && isPlayingGame) {
                this.jumpSound.play()
                this.velocity = 10;
                this.rotation = -20;
                this.hasJumped = true
                this.setRotation(this.rotation);
            }
        });

        document.addEventListener("mousedown", event => {
            if (event.button === 0 && !this.hasJumped && isPlayingGame) {
                this.jumpSound.play()
                this.velocity = 10;
                this.rotation = -20;
                this.hasJumped = true;
                this.setRotation(this.rotation);
            }
        });

        document.addEventListener("keyup", event => {
            if (event.code === "Space" && this.hasJumped && isPlayingGame) {
                this.hasJumped = false
            }
        });

        document.addEventListener("mouseup", event => {
            if (event.button === 0 && this.hasJumped && isPlayingGame) {
                this.hasJumped = false;
            }
        });

        this.animate = () => {
            const newY = this.getY() + this.velocity;
            const maximumHeight = gameAreaHeight - this.element.clientHeight;

            this.velocity -= 1;

            if (this.velocity < -8) {
                this.rotation = 20;
                this.setRotation(this.rotation);
            }

            if (newY <= 0) {
                this.setY(0);
                this.velocity = 0;
                this.rotation = 0;
                this.setRotation(this.rotation);
            } else if (newY > maximumHeight) {
                this.setY(maximumHeight);
                this.velocity = 0;
                this.rotation = 0;
                this.setRotation(this.rotation);
            } else {
                this.setY(newY);
            }
        };
        
        this.setY(gameAreaHeight / 2);
    }

    setRotation(degrees) {
        this.element.style.transition = "transform 0.2s ease-out";
        this.element.style.transform = `rotate(${degrees}deg)`;
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
    return collided
}

class Game {
    constructor() {
        const gameArea = document.querySelector("[wm-flappy]")
        const width = gameArea.clientWidth;
        const height = gameArea.clientHeight;


        var currentPopup = null
        const bird = new Bird(height);

        this.clearGame = () => {
            gameArea.innerHTML = "";
        }

        this.popup = function (texts, buttonSettings) {
            const popup = createElement("div", "bor1 bgcolor3 center rounded-corners popup")
            popup.setAttribute("id", "popup")

            texts.forEach(item => {
                const text = createElement("h1")
                text.textContent = item
                popup.appendChild(text)
            })

            const button = createElement("button")
            button.textContent = buttonSettings[0]
            button.addEventListener("click", buttonSettings[1], false)
            popup.appendChild(button)

            const p = createElement("p")
            popup.appendChild(p)

            gameArea.appendChild(popup)
            return popup
        }

        this.generate = () => {
            this.mainMenuMusic = new AudioEngine("main-menu-music", "sounds/main_menu_music.wav", "0.6", true)
            this.gameMusic = new AudioEngine("game-music", "sounds/game_music.wav", "0.9", true)
            this.gameOverMusic = new AudioEngine("gameover-music", "sounds/gameover_music.wav", "0.6", true)
            this.pointSound = new AudioEngine("point-sound", "sounds/point.wav", "0.3")
    
            gameArea.className = "normal-bgd center";
    
            this.points = 0;
           
    
            this.progress = new Progress();
            this.barriers = new Barriers(99, height, width, 300, 400, () => {
                this.progress.updatePoints(++this.points)
                this.pointSound.play()
            });
    
            gameArea.appendChild(bird.element);
            this.barriers.pairs.forEach(pair => gameArea.appendChild(pair.element));
        }

        this.start = () => {
            isPlayingGame = true;
            this.gameMusic.play()
            this.mainMenuMusic.stop()

            currentPopup ? currentPopup.remove() : null;

            (bird.getY() != height / 2) ? bird.setY(height / 2) : null;
            (bird.velocity != 0) ? 0 : null;
            (bird.rotation != 0) ? 0 : null;
            bird.setRotation(bird.rotation)

            gameArea.appendChild(this.progress.element);

            currentIntervalId = setInterval(() => {
                this.barriers.animate();
                bird.animate()

                if (collided(bird, this.barriers)) {
                    this.gameOver()
                }
            }, 20);
        };

        this.restart = () => {
            this.gameOverMusic.stop()
            clearInterval(currentIntervalId);
            this.generate()
            this.start()
        }

        this.gameOver = () => {
            isPlayingGame = false
            clearInterval(currentIntervalId);
            this.gameMusic.stop()
            bird.hitSound.play()

            setTimeout(() => {
                this.clearGame()
                bird.dieSound.play()

                this.gameOverMusic.play()

                currentPopup = this.popup(["Game Over", `Pontos: ${this.points}`], ["Jogar Denovo?", this.restart])
            }, 500);
        };

        this.showMainMenu = () => {
            this.mainMenuMusic.play()
            currentPopup = this.popup(["Flappy"], ["Jogar", this.start])
        }

        this.generate()
    }
}

var currentIntervalId = null
var isPlayingGame = false
var game = null