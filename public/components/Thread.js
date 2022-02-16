import { generateReply } from "/components/Reply.js";

const e_threadViewer = document.getElementById("thread-viewer");
const boardName = window.location.pathname.split('/')[2];

/**
 * Get any post by its unique ID
 * @param {Number} postId 
 * @returns Array of objects
 */
function getPost(postId) {
    return fetch(`/api/${boardName}/post/${postId}`)
        .then((resp) => resp.json())
}

function generateReplyForm() {
    const e_replyForm = document.createElement("form");
    e_replyForm.id = "reply-form";
    e_replyForm.action = "/post";

    e_replyForm.innerHTML = /* HTML */ `
        <input id="reply-username"
            name="username"
            maxlength="16"
            placeholder="Anonymous">

        <textarea id="reply-content"
                  name="content"
                  maxlength="1024"
                  placeholder="Type here"
        ></textarea>

        <input id="reply-submit" type="submit" value="Post Reply">
    `.trim();

    return e_replyForm;
}

/**
 * Open a thread in "large" view
 * @param {Number} threadId 
 * @param {HTMLElement} e_threadViewer - Parent element for the "large" thread view
 */
async function openLargeThread(threadId, e_threadViewer) {
    const op = await getPost(threadId);
    e_threadViewer.innerHTML = "";

    const e_closeButton = document.createElement("div");
    e_closeButton.className = "btn-viewer-close";
    e_closeButton.innerText = "Close";
    e_closeButton.onclick =()=> {
        e_threadViewer.hidden = true
    }
    e_threadViewer.appendChild(e_closeButton);

    const e_replyForm = generateReplyForm();
    e_threadViewer.appendChild(e_replyForm);

    const e_thread = generateThread(
        threadId,
        op.body.username,
        op.body.title,
        new Date(op.unix).toUTCString(),
        op.body.content,
    );

    // e_thread.querySelector(".post-id")
    //     .onclick =()=> openReply(threadId);

    const e_replies = e_thread.querySelector(".replies");

    for (const reply of op.replies) {
        const e_reply = generateReply(
            reply.id,
            reply.body.username,
            new Date(reply.unix).toUTCString(),
            reply.body.content,
        );

        e_replies.appendChild(e_reply);
    }

    e_threadViewer.appendChild(e_thread);
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
function generateThread(id, username, title, date, text) {
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
        .onclick =()=> openLargeThread(id, e_threadViewer)

    return e_thread;
}

export { generateThread, openLargeThread }