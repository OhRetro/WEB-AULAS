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

async function requestAnimalJSON() {
	const url = "https://raw.githubusercontent.com/NOVOTEC-NAKA/API/main/jsons/animals.json"
	const keys = ["media"]
	const data = await requestURL(url, keys)
	return await data
}

async function requestAnimalTranslation(language) {
	const url = "https://raw.githubusercontent.com/NOVOTEC-NAKA/API/main/jsons/animals.json"
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