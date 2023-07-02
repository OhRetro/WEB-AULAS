const blacklistedAnimals = ["duck"];

async function requestAnimalsJSON() {
	const animalRequestList = ["list", "lang"];
	const animalUrlBase = "https://naka-hub.vercel.app/animals";
	var animalsJson = {};

	const fetchPromises = animalRequestList.map(animalRequest =>
		fetch(`${animalUrlBase}/${animalRequest}.json`)
			.then(response => response.json())
			.then(response => (animalsJson[animalRequest] = response))
	);

	await Promise.all(fetchPromises);

	return animalsJson;
}

function changeImage(imageSrc = "images/black.png", text = " ", loadingMode = false) {
	const imageDisplay = document.getElementById("image-display");
	const caption = document.getElementById("caption");

	imageDisplay.src = imageSrc;
	imageDisplay.onload = function () {
		caption.innerHTML = text;
	};
}

async function getRandomAnimalFile(animal, displayName) {
	const animalsJson = await requestAnimalsJSON()
	
	changeImage("images/loading.gif", "Carregando...", true);

	const selectedAnimal = chooseRandomItem(animalsJson.list[animal]);
	fetch(selectedAnimal[0])
		.then((response) => response.json())
		.then((response) => {
			selectedAnimal[1].forEach((pathKey) => {
				response = response[pathKey];
			});

			changeImage(response, displayName);
		});

	if (document.getElementById("image-display").src.endsWith(".mp4")) {
		getRandomAnimalFile(animal, displayName);
	}
}

async function generateAnimalOptions(language) {
	const animalOptions = document.getElementById("animal-options");
	const animalsJson = await requestAnimalsJSON()
	
	const lang = animalsJson.lang[language];

	Object.keys(animalsJson.list).forEach((animalKey) => {
		if (blacklistedAnimals.includes(animalKey)) {
			return;
		}

		generateOption("animal-options", lang[animalKey], animalKey);
	});

	document.getElementById("get-animal-button").addEventListener("click", () => {
		getRandomAnimalFile(animalOptions.value, lang[animalOptions.value]);
	}, false);
}
