const express = require('express');
const fs = require('fs');

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
    // gets current time, in millisecond since 1/01/1970
    // so use the time formatting functions below 
    const d = new Date();

    // only run if string is not empty
    if (req.body.comments)
        return res.redirect('back');

    console.log(`Message: ${req.body.comments} | From: ${req.ip} | On: ${d.getUTCDate()}/${d.getUTCMonth()}/${d.getUTCFullYear()} | At: ${d.getUTCHours()}:${d.getUTCMinutes()} UTC`);

    fs.readFile(
        `${__dirname}\\views\\chatLog.json`,
        'utf-8',
        (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);

            data.push({
                date: `${d.getUTCDate}/${d.getUTCMonth()}/${d.getUTCFullYear()}`,
                time: `${d.getUTCHours()}:${d.getUTCMinutes()}`,
                sender: req.ip,
                message: req.body.comments,
            });

            fs.writeFile(
                `${__dirname}\\views\\chatLog.json`,
                JSON.stringify(data),
                (err) => {
                    if (err) throw err;
                }
            );
        }
    );

    res.redirect('back');
});

// use custom routing files
const userRouter = require('./routes/users.js');
app.use('/users', userRouter);

app.listen(4200);