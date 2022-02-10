// there is no definition for "require" in client side JavaScript
//const fs = require('fs');

function createNewButton(callerButton)
{
    const clone = document.createElement('button');
    clone.setAttribute("onclick", callerButton.getAttribute("onclick"));
    clone.innerText = callerButton.innerText;

    callerButton.ownerDocument.body.appendChild(clone);
}

function showImage()
{
    window.open(
        "https://www.w3schools.com/images/w3lynx_200.png",
        "imageViewer",
        "width=800,height=800"
    );
} 

// deprecated
function postComment(writtenComment)
{
    console.log(writtenComment);

    const message = document.createElement('p');
    message.innerText = writtenComment.value;

    writtenComment.ownerDocument.body.appendChild(message);
}

function prefixZero(number) {
    number = parseInt(number);

    if (number < 10 && number > -1)
        number = "0" + number;

    return number;
}

const messages = document.getElementById("messages");

// the <body onload="function()"> calls this
async function showChatLog()
{
    const chat = await fetch('./chatLog.json')
        .then(res => res.json())

    // special JS for loop magic, check it later ("of" keyword)
    for (const chat_line of chat) {
        const message = document.createElement('div');
        message.className = "message";

        const time = chat_line.time
            .split(":")
            .map((number) => prefixZero(number))
            .join(":")

        message.innerHTML = `
            <span class="msg-time">${time}</span>
            <span class="msg-sender">${chat_line.sender}</span>:
            <span class="msg-content">${chat_line.message}</span>
        `;

        messages.appendChild(message);
    }

    // const getData = () => {     // XMLHttpRequest() is a global constructor
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('GET', `${__dirname}\\chatLog.json'`);
    //     xhr.send();
    // };
}

function loadUsername() {
    const username = localStorage.username;

    if (username)
        document.getElementById("username").value = username;
}

function storeUsername() {
    localStorage.setItem(
        "username",
        document.getElementById("username").value
    );
}