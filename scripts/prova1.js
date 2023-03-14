function generatePoem(poemLines, parentElement) {
    poemLines.forEach(item => {
        if (item != "") {
            const line = createElement("i")
            line.textContent = item
            parentElement.appendChild(line)
        }
        parentElement.appendChild(createElement("br"))
    })
}

function buildSite() {
    const div = createElement("div", "bor1 rounded-corners bgcolor2 center")
    div.setAttribute("prova1", "")

    div.appendChild(createElement("br"))

    const img = createElement("img", "small-image-display margin-left float-left bor1 rounded-corners zoom-weak")
    img.setAttribute("src", "images/livro_aberto.jpg")

    const poemDiv = createElement("div", "left zoom-weak");
    generatePoem([
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
    ], poemDiv)

    div.appendChild(img)
    div.appendChild(poemDiv)
    document.body.appendChild(div)
}