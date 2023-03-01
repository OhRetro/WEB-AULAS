function changeImage(imageSrc = "images/black.png", text = " ", loadingMode = false) {
	const imageDisplay = document.getElementById("image-display")
	const caption = document.getElementById("caption")

	imageDisplay.src = imageSrc
	imageDisplay.onload = function () {
		caption.innerHTML = text
		if (loadingMode) {
            imageDisplay.onclick = ""
        } else {
            imageDisplay.onclick = function () {
				open(imageSrc)
			}
        }
	}
}

function generateOptions(elementId, name, value) {
	const option = document.createElement("option");
	option.textContent = name
	option.value = value
	document.getElementById(elementId).appendChild(option);
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
	changeImage("images/loading.gif", "Carregando...", true)
	const animals = await requestAnimalJSON()
	const selectedAnimal = animals[animal][Math.floor(Math.random() * animals[animal].length)]
	changeImage(await requestURL(selectedAnimal[0], selectedAnimal[1]), displayName)

	if (document.getElementById("image-display").src.endsWith(".mp4")) {
		getRandomAnimalFile(animal, displayName)
	}
}

async function generateAnimalOptions() {
	const animalOptions = document.getElementById("animal-options")
	const animals = await requestAnimalJSON()
	const translations = await requestAnimalTranslation("pt-br")
	const blacklistedAnimal = ["duck"]

	Object.keys(animals).forEach(function (key) {
		if (blacklistedAnimal.includes(key)) {
			return
		}

		const formattedKey = formatText(translations[key])
			

		generateOptions("animal-options", formattedKey, key);
	})

	document.getElementById("get-animal-button").addEventListener("click", function () {
		getRandomAnimalFile(animalOptions.value, formatText(translations[animalOptions.value]))
	}, false);
}