const e_threadViewer = document.getElementById("thread-viewer");

/**
 * Open a thread in "large" view
 * @param {Number} threadId 
 * @param {HTMLElement} e_threadViewer - Parent element for the "large" thread view
 */
function openThread(threadId, e_threadViewer) {
    console.log(threadId);
    e_threadViewer.hidden = false;
}

/**
 * Create a new thread element.
 * @param {Number} id - Thread ID
 * @param {String} username - Poster's display name
 * @param {String} title - Thread title
 * @param {String} date - Thread creation date
 * @param {String} text - Content of the OP
 * @returns HTMLElement
 */
function createThread(id, username, title, date, text) {
    const e_thread = document.createElement("div");
    e_thread.dataset.id = id;
    e_thread.className = "thread";
    e_thread.innerHTML = /* html */ `
        <div class="details">
            <span class="post-id">${id}</span>
            <span class="username">${username}</span>
            <span class="title">${title}</span>
            <span class="date">${date}</span>
        </div>

        <div class="text">${text}</div>
        <div class="replies"></div>
    `.trim();

    e_thread.querySelector(".post-id")
        .onclick =()=> openThread(id, e_threadViewer)

    return e_thread;
}

export { createThread, openThread }