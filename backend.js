const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const bfun = require('./backend_functions.js');


const app = express();


// this applies middleware to every HTTP event
app.use(bfun.reqLog);

// parse the body of HTTP requests
app.use(express.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//const bodyParser = require('body-parser');


// specify the rendering engine
// app.set('view engine', 'ejs');


bfun.timeLog('Server started:');



// use the current directory + additional ones for dependencies within files (MIDDLEWARE)
app.use(express.static('./public'));



// loading static files when server boots up

const homeHTML = fs.readFileSync(path.resolve(__dirname, 'public', 'home.html'), 'utf-8');
const homeCSS = fs.readFileSync(path.resolve(__dirname, 'public', 'home.css'), 'utf-8');
const homeJS = fs.readFileSync(path.resolve(__dirname, 'public', 'home.js'), 'utf-8');





// main page, the callback starts with REQ, then RES
app.get('/', (req, res) => {
    res.status(200).header( {'content-type': 'text/html' } ).send(homeHTML);

});


// example of query search
app.get('/api/chatlog/query', (req, res) => {

    const queryReq = req.query;

    fs.readFile(
        path.resolve(__dirname, 'public', 'chatLog.json'),
        'utf-8',
        (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            data = JSON.parse(data);
            let validReq = true;
            
            // get properties of objects inside the chatlog and the request (chatlog is an array of objects!)
            const fileProps = Object.keys(data[0]);
            const reqProps = Object.keys(queryReq);

            // goes through all the request properties, won't work if even one of them is invalid
            for (let i = 0; i < reqProps.length; i++) {
                if (!fileProps.includes(reqProps[i])) {
                    validReq = false;
                    break;
                }

                // the message property needs a special filter condition
                if (reqProps[i] === 'message') {
                    data = data.filter((line) =>  line.message.includes(queryReq.message));
                } else {
                    data = data.filter((line) => line[reqProps[i]] === queryReq[reqProps[i]]);
                }
            }

            // only send filtered data if all request properties are valid
            if (validReq) {
                res.status(200).header( {'content-type': 'application/json'} ).send(data);
            } else {
                res.status(404).header( {'content-type': 'text/plain'} ).send('Your request does not make sense');
            }
            
        }
    )
});





app.post('/', (req, res) => {
    // gets current time, in millisecond since 1/01/1970
    const d = new Date();

    // only run if string is not empty
    if (!req.body.username || !req.body.comments)
        return res.redirect('back');

    fs.readFile(
        path.resolve(__dirname, 'public', 'chatLog.json'),   // always use "path.resolve" so that the code can run on any OS
        'utf-8',
        (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            
            data = JSON.parse(data);

            data.push({
                date: [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()],
                time: [d.getUTCHours(), d.getUTCMinutes()],
                sender: req.body.username,
                message: req.body.comments,
            });

            fs.writeFile(
                path.resolve(__dirname, 'public', 'chatLog.json'),
                JSON.stringify(data),
                (err) => {
                    if (err) throw err;
                }
            );
        }
    );

    res.redirect('back');
});




// THREADS
/*
app.get('/threads.html', (req, res) => {

    // use streams instead of sending the whole file
    const filePath = path.resolve(__dirname, 'views', 'threads.html');
    const stream = fs.createReadStream(filePath);
    res.setHeader('Content-type', 'text/html');
    //res.writeHead(200);
    
    stream.pipe(res);
    res.end();
});
*/

// if the resource does not exist
app.all('*', (req, res) => {
    res.status(404).send('<h1>Resource could not be found</h1>');
});






// use custom routing files
/*
const userRouter = require('./routes/users.js');
app.use('/users', userRouter);
*/



const currentOS = {
    type: os.type(),
    release: os.release(),
    uptime: os.uptime(),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
};

console.log(currentOS);

app.listen(4200, () => {
    console.log('Server is up and listening on port 4200...')
});

