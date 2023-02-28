function changeImage(imageSrc = "images/black.png", text = " ") {
	const imageDisplay = document.getElementById("image-display")
	const caption = document.getElementById("caption")

	imageDisplay.src = imageSrc
	imageDisplay.onload = function () {
		caption.innerHTML = text
	}
}

function generateButtons(elementId, name, onClick) {
	const button = document.createElement("button");
	button.innerHTML = name
	button.addEventListener("click", onClick, false);
	button.className = "zoom zNormal"
	document.getElementById(elementId).appendChild(button);
}

async function requestURL(url, keys = []) {
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

async function requestGistAnimals() {
	const url = "https://api.github.com/gists/1a029cb0a734249019eadbb58013cc4d"
	const keys = ["files", "animals.json", "raw_url"]
	const data = await requestURL(url, keys)
	return await data
}

async function requestAnimalJSON() {
	const url = await requestGistAnimals()
	const keys = ["files"]
	const data = await requestURL(url, keys)
	return await data
}

async function requestAnimalTranslation(language) {
	const url = await requestGistAnimals()
	const keys = ["translations", language]
	const data = await requestURL(url, keys)
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
	const translations = await requestAnimalTranslation("pt-br")
	const blacklistedAnimal = ["duck"]

	Object.keys(animals).forEach(function (key) {
		if (blacklistedAnimal.includes(key)) {
			return
		}

		const formattedKey = translations[key]
			.replace(/_/g, " ")
			.split(" ")
			.map(function (word) {
				return word.charAt(0).toUpperCase() + word.slice(1)
			})
			.join(" ")

		generateButtons("animal-buttons", formattedKey, function () {
			getRandomAnimalFile(key, formattedKey)
		});
	})
}