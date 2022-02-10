const express = require('express');

// important for requests
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// specify the rendering engine
app.set('view engine', 'ejs');

// use the current directory + additional ones for dependencies within files
app.use(express.static(__dirname + '/views'));

app.get('/front_page', (req, res) => {
    // this uses EJS to render the page
    // res.render('front_page');

    // this just sends the file directly
    // __dirname is awesome, it gets the current directory
    res.sendFile(`${__dirname}\\views\\front_page.html`);
});

app.post('/front_page', (req, res) => {
    // gets current time in milliseconds since 1/01/1970,
    // so use the time formatting functions below
    const d = new Date();

    // only run if string is not empty
    if ( req.body.comments != "" ) {
        console.log(`Message: ${req.body.comments} | From: ${req.ip} | On: ${d.getUTCDate()}/${d.getUTCMonth()}/${d.getUTCFullYear()} | At: ${d.getUTCHours()}:${d.getUTCMinutes()} UTC`);
    }

    res.redirect('back');
});

// use custom routing files
const userRouter = require('./routes/users.js');
app.use('/users', userRouter);

app.listen(4200);