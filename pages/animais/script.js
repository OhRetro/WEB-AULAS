function changeImage(imageSrc="images/black.png", text=" ") {
  const imageDisplay = document.getElementById("imageDisplay")
  const caption = document.getElementById("caption")

  imageDisplay.src = imageSrc
  imageDisplay.onload = function() {
    caption.innerHTML = text
  }
}

function generateButtons(elementId, name, onClick) {
  const button = document.createElement("button");
  button.innerHTML = name
  button.addEventListener("click", onClick, false);
  document.getElementById(elementId).appendChild(button);
}

async function requestURL(url, keys=[]) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  var result = await response.json()
  keys.forEach(function (key) {
    result = result[key];
  });
  return await result
}

async function requestAnimalJSON() {
  const url = "https://gist.githubusercontent.com/NOVOTEC-NAKA/1a029cb0a734249019eadbb58013cc4d/raw/f37ae34659eedefd9896b346698aebb85ce2beb8/animals.json"
  const data = await requestURL(url, ["files"])
  return await data
}

async function getRandomAnimalFile(animal, displayName) {
  changeImage("images/loading.gif", "Carregando...")
  const animals = await requestAnimalJSON()
  const selectedAnimal = animals[animal][Math.floor(Math.random() * animals[animal].length)]
  changeImage(await requestURL(selectedAnimal[0], selectedAnimal[1]), displayName)
}

async function generateAnimalButtons() {
  const animals = await requestAnimalJSON()
  const blacklistedAnimal = ["duck"]

  Object.keys(animals).forEach(function (key) {
    if (blacklistedAnimal.includes(key)) {
      return
    }

    const formattedKey = key
      .replace(/_/g, " ")
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    generateButtons("animalButtons", formattedKey, function () {
      getRandomAnimalFile(key, formattedKey)
    });
  })
}