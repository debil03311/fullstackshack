const express = require('express');
const bodyParser = require('body-parser');  // important for requests
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');  // specify the rendering engine
app.use(express.static(__dirname + '/views'));      // use the current directory + additional ones for dependencies within files

app.get('/front_page', (req, res) => {
    //res.render('front_page');     // this uses EJS to render the page
    // this just sends the file directly
    res.sendFile(`${__dirname}\\views\\front_page.html`);   // __dirname is awesome, it gets the current directory
});

app.post('/front_page', (req, res) => {
    const d = new Date();   // gets current time, in millisecond since 1/01/1970, so use the time formatting functions below 

    if ( req.body.comments != "" ) {    // only run if string is not empty
        console.log(`Message: ${req.body.comments} | From: ${req.ip} | On: ${d.getUTCDate()}/${d.getUTCMonth()}/${d.getUTCFullYear()} | At: ${d.getUTCHours()}:${d.getUTCMinutes()} UTC`);
    }

    res.redirect('back');
});


const userRouter = require('./routes/users.js');    // use custom routing files
app.use('/users', userRouter);

app.listen(4200);