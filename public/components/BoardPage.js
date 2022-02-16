import { generateThread } from "/components/Thread.js";
import { generateReply } from "/components/Reply.js";

const replyPreviews = 3;

/**
 * Gets a list of threads for the given board and page
 * @param {String} boardName 
 * @param {Number} pageIndex
 * @param {HTMLElement} e_threadList - Parent element for all threads
 */
async function loadPage(boardName, pageIndex, e_threadList) {
    // empty current thread list
    e_threadList.innerHTML = "";

    // fetch array of threads from the api
    const threads = await fetch(`/api/${boardName}/page/${pageIndex}`)
        .then((resp)=> resp.json())

    if (!threads[0]) {
        e_threadList.innerHTML = /* HTML */ `
            <div id="no-threads" class="thread fade-in">
                No threads on this page, go make some!
            </div>
        `.trim();
    }

    for (const thread of threads) {
        if (!thread) break;

        const e_thread = generateThread(
            thread.id,
            thread.body.username,
            thread.body.title,
            new Date(thread.unix).toUTCString(),
            thread.body.content,
        );

        const e_threadReplies = e_thread.querySelector(".replies");

        for (let replyIndex=0; replyIndex<replyPreviews; replyIndex++) {
            const reply = thread.replies[replyIndex];
            if (!reply) break;

            const e_reply = generateReply(
                reply.id,
                reply.body.username,
                new Date(reply.unix).toUTCString(),
                reply.body.content,
            );

            e_threadReplies.appendChild(e_reply);
        }

        e_threadList.appendChild(e_thread);
    }
}

export { loadPage }