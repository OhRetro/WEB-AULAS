function change(imageSrc="images/black.png", text=" ") {
    document.getElementById("imageDisplay").src = imageSrc
    document.getElementById("caption").innerHTML = text
}

function getAnimal() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://gist.githubusercontent.com/NOVOTEC-NAKA/1a029cb0a734249019eadbb58013cc4d/raw/f37ae34659eedefd9896b346698aebb85ce2beb8/animals.json', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        // do something with the JSON data
        console.log(data);
      }
    };
    xhr.send();
}
