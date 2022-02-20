const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const bfun = require('./backend_functions.js');
const cookieParser = require('cookie-parser');

// routes
const homeRouter = require(path.resolve(__dirname, 'routes', 'homeRouter.js'));
const apiRouter = require(path.resolve(__dirname, 'routes', 'apiRouter.js'));

const app = express();


// this applies middleware to every HTTP event in this exact order
app.use(cookieParser());
app.use(bfun.cookieCheck);
app.use(bfun.reqLog);


// parse the body of HTTP requests
app.use(express.urlencoded({ extended: false }));

// using the routers in order
app.use('/api', apiRouter);
app.use('/', homeRouter);




// if the resource does not exist
app.all('*', (req, res) => {
    res.status(404).send('<h1>Resource could not be found</h1>');
});



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

