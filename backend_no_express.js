const http = require('http');
const fs = require('fs');

const host = 'localhost';
const port = 4200;

const server = http.createServer(function(req, res) {

    res.setHeader('Content-type', 'text/html');     // the 2nd parameter is the MIME type of your response
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.writeHead(200);    // writeHead is the status code, only place it once at the end, there are a LOT of possible status codes

    // just some data for testing purposes
    /*  
    let dataObj = { id:123, name:"Bob", email:"bob@work.org" };
    let data = JSON.stringify(dataObj);
    */

    const home = 1;
    fs.readFile('./front_page.html', 'utf-8', function(err, txt) {
        home = txt;
    });
    res.end(home);
});


server.listen(port, host, function() {
    console.log(`Server is running on http://${host}:${port}`);
});


fs.readFile('./hello.txt', 'utf-8', function(err, txt) {
    console.log(txt);
})