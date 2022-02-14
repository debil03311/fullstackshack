const express = require('express');
const fs = require('fs');
const path = require('path');


const router = express.Router();

const homeHTML = fs.readFileSync(path.resolve(__dirname, '..', 'public', 'home.html'), 'utf-8');
const homeCSS = fs.readFileSync(path.resolve(__dirname, '..', 'public', 'home.css'), 'utf-8');
const homeJS = fs.readFileSync(path.resolve(__dirname, '..', 'public', 'home.js'), 'utf-8');
const homeICON = fs.readFileSync(path.resolve(__dirname, '..', 'public', 'favicon.ico'), 'utf-8');

// method GET

router.get('/', (req, res) => {
    res.status(200).header( {'content-type': 'text/html' } ).send(homeHTML);
});


router.get('/home.html', (req, res) => {
    res.status(200).header( {'content-type': 'text/html' } ).send(homeHTML);
});


router.get('/home.js', (req, res) => {
    res.status(200).header( {'content-type': 'application/javascript' } ).send(homeJS);
});


router.get('/home.css', (req, res) => {
    res.status(200).header( {'content-type': 'text/css' } ).send(homeCSS);
});


// dynamic files should only be loaded when working with them, not when the server boots up
router.get('/chatLog.json', (req, res) => {
    res.status(200).header( {'content-type': 'application/json' } ).sendFile(path.resolve(__dirname, '..', 'public', 'chatLog.json'));
});


router.get('/favicon.ico', (req, res) => {
    res.status(200).header( {'content-type': 'image/vnc.microsoft.icon' } ).send(homeICON);
});



// method POST

router.post('/post', (req, res) => {

    const time = new Date();
    const board = req.body.board;

    // the reading can start async, but everything after needs to be sync
    fs.readFile(
        path.resolve(__dirname, '..', 'public', 'boards', board, 'threads.json'),
        'utf-8',
        (err, threadsFile) => {
            
            // the threads file within the board folder must already exist
            if (err) {
                res.status(404).header( {'content-type': 'text/plain' } ).send('The board does not exist');
                return;
            }

            let postsTrackFile = fs.readFileSync(path.resolve(__dirname, '..', 'public', 'num_of_posts.txt'));
            postsTrackFile = JSON.parse(data);



        }
    );
});






router.post('/', (req, res) => {
    const d = new Date();

    // only run if string is not empty
    if (!req.body.username || !req.body.comments)
        return res.redirect('back');

    let data = fs.readFileSync(
        path.resolve(__dirname, '..', 'public', 'chatLog.json'),
        'utf-8'
    );
        
    data = JSON.parse(data);

    data.push({
        date: [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()],
        time: [d.getUTCHours(), d.getUTCMinutes()],
        sender: req.body.username,
        message: req.body.comments,
    });

    fs.writeFileSync(
        path.resolve(__dirname, '..', 'public', 'chatLog.json'),
        JSON.stringify(data),
        'utf-8'
    );

    res.redirect('back');
});

// export router
module.exports = router;