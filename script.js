function pageTitle(title="", prevType=0) {
    const prevTypes = [["../../index.html", "Home"], ["../index.html", "Voltar"]]

    const bodyTitle = document.getElementById("page-body-title");
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

function generatePagesLink(links) {
    const pagesLink = document.getElementById("pages-link");

    links.forEach(element => {
        const li = document.createElement("li")
        li.className = "zoom zNormal"

        const a = document.createElement("a");
        a.href = "pages/" + element[0] + "/index.html";
        a.text = element[1];
        
        li.appendChild(a);
        pagesLink.appendChild(li);
    });
}