function generateListItems(elementId, items) {
    items.forEach(function (item) {
        const listItem = generateListItem(elementId, item)
        listItem.classList.add("zoom")
        listItem.classList.add("zWeak")
    })
}