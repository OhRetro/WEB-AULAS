function pageTitle(title="") {
    const body_title = document.getElementById("page_body_title");
    if (title != "") {
        title = "/ "+title;
        const a_link = document.createElement("a");
        a_link.href = "../../index.html";
        a_link.text = "Home";
        body_title.appendChild(a_link);

    }
    document.title = "WEB-AULAS "+title;
    if (title != "") { 
        //body_title.textContent += title;
        return;
    }
    body_title.textContent = "WEB-AULAS";
}