function pageTitle(title="", prevType=0, typeOne="index.html") {
    const prevTypes = [["index.html", "Home"], [typeOne, "Voltar"]]

    const bodyTitle = document.getElementById("page-body-title");
    bodyTitle.textContent = "";
    if (title != "") {
        title = " / "+title;
        const a = document.createElement("a");
        a.href = prevTypes[prevType][0];
        a.text = prevTypes[prevType][1];
        bodyTitle.appendChild(a);

    }
    document.title = "WEB-AULAS "+title;
    if (title != "") { 
        const a = document.createElement("a");
        a.text = title;
        bodyTitle.appendChild(a);
        return;
    }
    bodyTitle.textContent = "WEB-AULAS";
}

function generatePagesLink(section, links) {
    const pagesLink = document.getElementById("pages-link-"+section);

    links.forEach(element => {
        const li = document.createElement("li")
        li.className = "zoom zNormal"

        const a = document.createElement("a");
        a.href = element[0] + ".html";
        a.text = element[1];
        
        li.appendChild(a);
        pagesLink.appendChild(li);
    });
}

function generateOption(elementId, name, value) {
	const option = document.createElement("option");
	option.textContent = name;
	option.value = value;
	document.getElementById(elementId).appendChild(option);
    return option;
}

function generateButton(elementId, name, onClick) {
    const button = document.createElement("button");
    button.textContent = name;
    button.addEventListener("click", onClick, false)
    document.getElementById(elementId).appendChild(button);
    return button;
}

function generateListItem(elementId, name) {
    const li = document.createElement("li");
    li.textContent = name;
    document.getElementById(elementId).appendChild(li);
    return li;
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

function formatText(text) {
	return text
		.replace(/_/g, " ")
		.split(" ")
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1)
		})
		.join(" ")
}

function chooseRandomItem(list) {
    return list[Math.floor(Math.random()*list.length)]
}