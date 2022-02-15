const express = require('express');
const fs = require('fs');
const path = require('path');


const router = express.Router();


// method GET

router.get('/', (req, res) => {
    
    const filePath = path.resolve(__dirname, '..', 'public', 'home.html');
    fs.readFile( 
        filePath,
        'utf-8',
        (err, data) => {
            if (err) {
                res.status(404).header( {'content-type': 'text/html' } ).send('The home file does not exist apparently');
                return;
            }
            res.status(200).header( {'content-type': 'text/html' } ).send(data);

        }
    );
});


router.get('/*', (req, res) => {

    const filePath = path.normalize(path.resolve(__dirname, '..', 'public') + req.originalUrl);
    const fileExt = path.extname(filePath);

    // cannot request anything outside of /public
    if ( !filePath.includes(path.resolve(__dirname, '..', 'public')) ) {
        console.log(filePath);
        res.status(404).header( {'content-type': 'text/html' } ).send('Cannot request resources outside the public folder');
        return;
    }

    // if the file extention is valid, proceed
    const extTypes = ['.html', '.js', '.css', '.vue', '.jpg', '.jpeg', '.ico', '.json'];
    if ( (!extTypes.includes(fileExt)) && (!extTypes.includes(fileExt.toUpperCase()) ) ) {
        res.status(404).header( {'content-type': 'text/html' } ).send('Invalid file extension');
        return;
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).header( {'content-type': 'text/html' } ).send('The resource does not exist');
            return;
        }

        // MIME types for every valid file extension
        const MIME = { 
            '.HTML': 'text/html' , '.CSS': 'text/css', '.JS': 'application/javascript', '.JSON': 'application/json',
            '.ICO': 'image/vnd.microsoft.icon',
        };

        for (let headerExt in MIME) {
            if (fileExt.toUpperCase() === headerExt) {
                res.status(200).header( {'content-type': MIME[headerExt] } ).send(data);
            }
        }


    }); 

});



// method POST

// work in progress
router.post('/post', (req, res) => {

    const time = new Date();

    // very important POST validator, so that users don't break the server by posting an incorrect body format
    const validThread = { board: 'string', postType: 'string', username: 'string', content: 'string', title: 'string' };
    const validReply = { board: 'string', postType: 'string', username: 'string', content: 'string', parentID: 'string' };
    const validThreadProps = Object.keys(validThread);
    const validReplyProps = Object.keys(validReply);
    const requestBodyProps = Object.keys(req.body);

    if ( req.body.postType === "op") {

        // check if the number of properties match
        if (requestBodyProps.length === validThreadProps.length) {

            // check if the names of the properties match
            for (let propName of validThreadProps) {
                if (!requestBodyProps.includes(propName)) {
                    console.log('Body doesn\'t have the correct property names');
                    res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format');
                    return;
                }
            }

            // check if the data types of properties match
            // in for...in loops with objects, the variable is the name of the property from the object
            for (let propName in req.body) {
                if (typeof(req.body[propName]) !== validThread[propName]) {
                    console.log('Body doesn\'t have the correct property data types');
                    res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format');
                    return;
                }
            }

        } else {
            console.log('Body doesn\'t have the correct number of properties');
            res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format');
            return;
        }

    } else if ( req.body.postType === "reply") {

        if (requestBodyProps.length === validReplyProps.length) {

            // check if the names of the properties match
            for (let propName of validReplyProps) {
                if (!requestBodyProps.includes(propName)) {
                    console.log('Body doesn\'t have the correct property names');
                    res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format');
                    return;
                }

                // check if the data types of properties match
                // in for...in loops with objects, the variable is the name of the property from the object
                for (let propName in req.body) {
                    if (typeof(req.body[propName]) !== validReply[propName]) {
                        console.log('Body doesn\'t have the correct property data types');
                        res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format');
                        return;
                    }
                }
            }

        } else {
            console.log('Body doesn\'t have the correct number of properties');
            res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format');
            return;
        }

    } else {
        console.log('Post type isn\'t OP nor REPLY');
        res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format');
        return;
    }


    
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
            const newPostID = postsTrackFile.board + 1;
            let newPost = 'placeholder';

            if (req.body.postType === 'op') {

                newPost = {
                    type: "op",
                    id: newPostID,
                    unix: time,
                    body: 
                    {
                        username: req.body.username,
                        title: req.body.title,
                        content: req.body.content
                    },
                    replies: []
                }
            } else if (req.body.postType === 'reply') {

                newPost = {
                    type: "reply",
                    id: newPostID,
                    unix: time,
                    body: 
                    {
                        username: req.body.username,
                        content: req.body.content 
                    }
                }
            } else {
                res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, how did you get past my first validator?');
                return;
            }

            // resume here
            // increase the post ID number in num_of_posts.json
            // and add the newPost to the correct threads.json

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