/**
 * Append board name anchors to an HTML element.
 * @param {HTMLElement} e_boardList - Parent element for the board buttons
 */
async function loadBoards(e_boardList) {
    const boards = await fetch("/api/boards")
        .then((resp) => resp.json())

    for (const board of boards) {
        const e_boardAnchor = document.createElement("a");
        e_boardAnchor.className = "board";
        e_boardAnchor.href = `/board/${board}`;
        e_boardAnchor.innerText = `/${board}/`;

        e_boardList.appendChild(e_boardAnchor);
    }
}

export { loadBoards }