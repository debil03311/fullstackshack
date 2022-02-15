import { loadBoards } from "/components/BoardList.js";
import { loadPage } from "/components/BoardPage.js";
import { openThread } from "/components/Thread.js";

let globalPageIndex = 1;
const pageCount = 4;

const e_boardName = document.getElementById("board-name");
const e_boardList = document.getElementById("board-list");
const e_threadList = document.getElementById("board-threads");
const e_threadViewer = document.getElementById("thread-viewer");

// open thread if in URL hash
(window.location.hash) && openThread(window.location.hash, e_threadViewer);

// set board name on the page

const boardName = window.location.pathname.split('/')[2];
e_boardName.innerText = boardName;

// fill all page selectors with page buttons

const e_pageSelectors = document.querySelectorAll(".page-selector");

for (const e_selector of e_pageSelectors) {
    // left arrow button
    const e_pageButtonPrevious = document.createElement("span");
    e_pageButtonPrevious.classList.add("btn-page", "btn-previous");
    e_pageButtonPrevious.innerText = "\u294A"; // ⥊
    e_pageButtonPrevious.onclick = prevPage;

    e_selector.appendChild(e_pageButtonPrevious);

    // page buttons
    for (let pageIndex = 1; pageIndex <= pageCount; pageIndex++) {
        const e_pageButton = document.createElement("span");
        e_pageButton.className = "btn-page";
        e_pageButton.innerText = pageIndex;

        e_pageButton.onclick =(event)=> {
            event.preventDefault();
            loadPage(boardName, pageIndex, e_threadList);
            activePageButton(globalPageIndex = pageIndex);
        }

        e_selector.appendChild(e_pageButton);
    }

    // right arrow button
    const e_pageButtonNext = document.createElement("span");
    e_pageButtonNext.classList.add("btn-page", "btn-previous");
    e_pageButtonNext.innerText = "\u294B"; // ⥋
    e_pageButtonNext.onclick = nextPage;

    e_selector.appendChild(e_pageButtonNext);
}

// highlight the active page button by adding .btn-active to it

// all buttons in every selector
const e_pageButtons = document.querySelectorAll(".btn-page");

function activePageButton(pageIndex) {
    // remove .btn-active from every button
    for (const e_button of e_pageButtons) {
        e_button.classList.remove("btn-active");
        
        // add .btn-active to the right one
        if (e_button.innerText == pageIndex)
            e_button.classList.add("btn-active");
    }
};

// page navigation

function prevPage(event) {
    event.preventDefault();
    globalPageIndex--;

    if (globalPageIndex < 1)
        globalPageIndex = pageCount;

    loadPage(boardName, globalPageIndex, e_threadList);
    activePageButton(globalPageIndex);
}

function nextPage(event) {
    event.preventDefault();
    globalPageIndex++;

    if (globalPageIndex > pageCount)
        globalPageIndex = 1;

    loadPage(boardName, globalPageIndex, e_threadList);
    activePageButton(globalPageIndex);
}

// load the rest of the page

loadBoards(e_boardList);
loadPage(boardName, 1, e_threadList);
activePageButton(globalPageIndex);