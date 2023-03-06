const animalsJsonUrl = "https://oreto-api.vercel.app/api/animals"

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
	return await requestURL(animalsJsonUrl)
}

async function getRandomAnimalFile(animal, displayName) {
	changeImage("images/loading.gif", "Carregando...", true)

	const animalsJson = await requestAnimalJSON()
	const animals = await animalsJson["media"]
	const selectedAnimal = chooseRandomItem(animals[animal])

	changeImage(await requestURL(selectedAnimal[0], selectedAnimal[1]), displayName)
	
	if (document.getElementById("image-display").src.endsWith(".mp4")) {
		getRandomAnimalFile(animal, displayName)
	}
}

async function generateAnimalOptions(language) {
	const animalOptions = document.getElementById("animal-options")
	const animalsJson = await requestAnimalJSON()
	const animals = await animalsJson["media"]
	const translations = await animalsJson["translations"][language]
	const blacklistedAnimals = ["duck"]
	
	Object.keys(animals).forEach(function (key) {
		if (blacklistedAnimals.includes(key)) {
			return
		}
		const formattedKey = formatText(translations[key])
		generateOption("animal-options", formattedKey, key);
	})

	document.getElementById("get-animal-button").addEventListener("click", function () {
		getRandomAnimalFile(animalOptions.value, formatText(translations[animalOptions.value]))
	}, false);
}