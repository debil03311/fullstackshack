/**
 * Create a new reply element.
 * @param {Number} id - Reply ID
 * @param {String} username - Poster's display name
 * @param {String} date - Reply creation date
 * @param {String} text - Content of the reply
 * @returns HTMLElement
 */
function generateReply(id, username, date, text) {
    const e_reply = document.createElement("div");
    e_reply.dataset.id = id;
    e_reply.className = "reply";
    e_reply.innerHTML = /* html */ `
        <div class="details">
            <span class="post-id">${id}</span>
            <span class="username">${username}</span>
            <span class="date">${date}</span>
        </div>

        <div class="text">${text}</div>
    `.trim();

    return e_reply;
}

export { generateReply }