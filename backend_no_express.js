// object modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const util = require('util');

// class modules
const EventEmmiter = require('events');


// change between 'full' and 'stream', for big files choose stream
const fileTransMethod = 'full';

const customEmitter = new EventEmmiter();

customEmitter.on('customEvent', (file) => {
    console.log(`Sent ${file}`);
});



// HTTP/1.1 server
const server = http.createServer();

// this is a promise, it is used to make cleaner code without nested callbacks
const getText = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// and this is what "util" can do, write promises so you don't have to (might require additional parameters)
const getTextPromise = util.promisify(fs.readFile);


// when the server boots up, it loads all of those files in memory
const homeHTML = fs.readFileSync(path.resolve(__dirname, 'views', 'home.html'), 'utf8');
const homeCSS = fs.readFileSync(path.resolve(__dirname, 'views', 'home.css'), 'utf8');
const homeJS = fs.readFileSync(path.resolve(__dirname, 'views', 'home.js'), 'utf8');







// code for request event
server.on('request', (req, res) => {

    // exact moment when the server received the request
    const d = new Date();

    // code for GET method
    if (req.method === 'GET') {

        // used to send entire files at once
        if (fileTransMethod === 'full') {

            // home page
            if (req.url === '/') {
                res.writeHead(200, { 'content-type': 'text/html' });
                res.write(homeHTML);
            } else if (req.url === '/home.css') {
                res.writeHead(200, { 'content-type': 'text/css' });
                res.write(homeCSS);
            } else if (req.url === '/home.js') {
                res.writeHead(200, { 'content-type': 'text/javascript' });
                res.write(homeCSS);
            }
            // chatLog.json
            else if (req.url === './chatLog.json') {
                const chatLog = fs.readFileSync(path.resolve(__dirname, 'views', 'chatLog.json'));
                res.writeHead(200, { 'content-type': 'text/json' });
                res.write(chatLog);
            } else {
                res.writeHead(404, { 'content-type': 'text/plain' });
                res.write('Resource does not exist');
            }
        }
        
        
    } 
    // code for POST method
    else if (req.method === 'POST') {

        // home page
        if (req.url === '/') {

            let data = '';
            req.on('data', chunk => {
                data = data + chunk;
            });
            req.on('end', () => {

                const chatLog = fs.readFileSync(path.resolve(__dirname, 'views', 'chatLog.json'));
                const newChatLog = JSON.parse(chatLog);

                // parsing this data is annoying...
                const array = data.split('&');
                const username = array[0].split('=');
                const comments = array[1].split('=');
                
                newChatLog.push({
                    date: `${d.getUTCDate()}/${d.getUTCMonth()}/${d.getUTCFullYear()}`,
                    time: `${d.getUTCHours()}:${d.getUTCMinutes()}`,
                    sender: username[1],
                    message: comments[1],
                });

                //console.log(JSON.stringify(newChatLog));
                fs.writeFileSync(path.resolve(__dirname, 'views', 'chatLog.json'), JSON.stringify(newChatLog), 'utf-8');
                
            });

            res.writeHead(201);
            

        } else {
            res.writeHead(404);
            res.write('Cannot POST here');
        }
    }
    res.end();

    // old code
    /*
    if ( (req.url === '/') && (fileTransMethod === 'full') ) {
        console.log('Requested the front_page');

        const start = async () => {

            try {
                // headers for the browser to understand what it's receiving 
                res.setHeader('Content-type', 'text/html');
                res.setHeader('Access-Control-Allow-Origin', "*");
            
                const pagePath = path.resolve(__dirname, 'views', 'front_page.html');
                const page = await getTextPromise(pagePath, 'utf8');

                // send headers first
                res.writeHead(200);

                // seding the page and dependencies
                res.write(page, 'utf-8');
                //res.write(pageJS, 'utf-8');
                
                // sending a resonse and emitting an event
                res.end();
                customEmitter.emit('customEvent', pagePath);

            } catch (error) {
                console.log(error);
            }
        }
        start();
        
    } else if ( (req.url === '/') && (fileTransMethod === 'stream') ) {

        const pagePath = path.resolve(__dirname, 'views', 'front_page.html');
        const pageStream = fs.createReadStream(pagePath, 'utf8');
        pageStream.on('open', () => {

            res.setHeader('Transfer-Encoding', 'chunked');
            res.writeHead(200);
            pageStream.pipe(res);
        });
        pageStream.on('error', (err) => {
            res.writeHead(404);
            res.end(err);
        });


    } else {
        res.writeHead(404);
        res.write('Resource does not exist');
        res.end();
    }
    */
    
});


server.listen('4200', 'localhost', () => {
    console.log(`Server is running on localhost:4200`);
});
