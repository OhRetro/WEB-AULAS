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