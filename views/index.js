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
    window.open("https://www.w3schools.com/images/w3lynx_200.png", "imageViewer", "width=800,height=800");
} 

// deprecated
function postComment(writtenComment)
{
    console.log(writtenComment);

    const message = document.createElement('p');
    message.innerText = writtenComment.value;

    writtenComment.ownerDocument.body.appendChild(message);
}

// the <body onload="function()"> calls this
function showChatLog()
{
    console.log('what');

    fetch('./chatLog.json')
        .then(res => res.json())
        .then(data => console.log(data));

    // const getData = () => {     // XMLHttpRequest() is a global constructor
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('GET', `${__dirname}\\chatLog.json'`);
    //     xhr.send();
    // };
}