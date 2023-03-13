function generateParagraph(paragraphs, elementToAppend) {
    paragraphs.forEach(item => {
        const paragraph = createElement("i", "zoom zWeak")
        paragraph.textContent = item
        elementToAppend.appendChild(paragraph)
        elementToAppend.appendChild(createElement("br"))
    })
}

function build() {
    const div = createElement("div", "bor1 rounded-corners bgcolor2 center")
    div.setAttribute("prova1", "")

    div.appendChild(createElement("br"))

    const img = createElement("img", "small-image-display margin-left float-left bor1 rounded-corners")
    img.setAttribute("src", "https://asset.nasen.org.uk/styles/690_auto/public/media/2020-11/generic%20book%20open.jpg?itok=mS2HwCG0")

    const div1 = createElement("div", "left");
    generateParagraph([
        "AUTOPSICOGRAFIA",
        "",
        "O poeta é um fingidor.",
        "Finge tão completamente",
        "Que chega a fingir que é dor",
        "A dor que deveras sente.",
        "",
        "E os que lêem o que escreve,",
        "Na dor lida sentem bem,",
        "Não as duas que ele teve,",
        "Mas só a que eles não têm.",
        "",
        "E assim nas calhas da roda",
        "Gira, a entreter a razão,",
        "Esse comboio de corda",
        "Que se chama o coração.",
    ], div1)

    div.appendChild(img)
    div.appendChild(div1)
    document.body.appendChild(div)
}