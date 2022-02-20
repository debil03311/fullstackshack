const { timeEnd } = require('console');
const express = require('express');
const fs = require('fs');
const { arch } = require('os');
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



router.get('/board/:board', (req, res) => {

    const filePath = path.resolve(__dirname, '..', 'public', 'boards', req.params.board, 'index.html');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).header( {'content-type': 'text/html' } ).send('The specified board does not exist');
            return;
        }

        res.status(200).header( {'content-type': 'text/html' } ).send(data);
    });

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

router.post('/post', (req, res) => {

    const time = new Date();
    console.log(req.body);

    // for anons
    if (req.body.username === '') {
        req.body.username = 'Anonymous';
    }


    // very important POST validator, so that users don't break the server by posting an incorrect body format
    const validThread = { board: 'string', 'post-type': 'string', username: 'string', content: 'string', title: 'string' };
    const validReply = { board: 'string', 'post-type': 'string', username: 'string', content: 'string', 'parent-thread': 'string' };
    const validThreadProps = Object.keys(validThread);
    const validReplyProps = Object.keys(validReply);
    const requestBodyProps = Object.keys(req.body);


    // OP type
    if ( req.body['post-type'] === "OP") {

        // check if the number of properties match
        if (requestBodyProps.length === validThreadProps.length) {

            // check if the names of the properties match
            for (let propName of validThreadProps) {
                if (!requestBodyProps.includes(propName)) {
                    console.log('Body doesn\'t have the correct property names');
                    res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, incorrect property names');
                    return;
                }
            }

            // check if the data types of properties match
            // in for...in loops with objects, the variable is the name of the property from the object
            for (let propName in req.body) {
                if (typeof(req.body[propName]) !== validThread[propName]) {
                    console.log('Body doesn\'t have the correct property data types');
                    res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, incorrect property data types');
                    return;
                }
            }

        } else {
            console.log('Body doesn\'t have the correct number of properties');
            res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, incorrect number of properties');
            return;
        }

    // REPLY type
    } else if ( req.body['post-type'] === "REPLY") {

        if (requestBodyProps.length === validReplyProps.length) {

            // check if the names of the properties match
            for (let propName of validReplyProps) {
                if (!requestBodyProps.includes(propName)) {
                    console.log('Body doesn\'t have the correct property names');
                    res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, incorrect property names');
                    return;
                }

                // check if the data types of properties match
                // in for...in loops with objects, the variable is the name of the property from the object
                for (let propName in req.body) {
                    if (typeof(req.body[propName]) !== validReply[propName]) {
                        console.log('Body doesn\'t have the correct property data types');
                        res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, incorrect property data types');
                        return;
                    }
                }
            }

        } else {
            console.log('Body doesn\'t have the correct number of properties');
            res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, incorrect number of properties');
            return;
        }

    } else {
        console.log('Post type isn\'t OP nor REPLY');
        res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, impossible type');
        return;
    }


    
    // the reading can start async, but everything after needs to be sync
    fs.readFile(
        path.resolve(__dirname, '..', 'public', 'boards', req.body.board, 'threads.json'),
        'utf-8',
        (err, threadsFile) => {
            
            // the threads file within the board folder must already exist
            if (err) {
                res.status(404).header( {'content-type': 'text/plain' } ).send('The board does not exist');
                return;
            }

            let postsTrackFile = fs.readFileSync(path.resolve(__dirname, '..', 'public', 'num_of_posts.json'), 'utf-8');
            postsTrackFile = JSON.parse(postsTrackFile);

            const newPostID = postsTrackFile[req.body.board] + 1;
            let newPost = 'placeholder';

            // OP type
            if (req.body['post-type'] === 'OP') {

                newPost = {
                    type: "OP",
                    id: newPostID,
                    unix: time.getTime(),
                    body: 
                    {
                        username: req.body.username,
                        title: req.body.title,
                        content: req.body.content
                    },
                    replies: []
                }

                threadsFile = JSON.parse(threadsFile);
                threadsFile.unshift(newPost);

                // archive last thread
                if (threadsFile.length >= 41) {

                    const fileName = `${time.getUTCFullYear()}${time.getUTCMonth() + 1}${time.getUTCDate()}.json`;
                    const archivePath = path.resolve(__dirname, '..', 'archive', 'boards', req.body.board);

                    // file already exists
                    if ( fs.existsSync(path.resolve(archivePath, fileName)) ) {

                        let archive = fs.readFileSync(path.resolve(archivePath, fileName), 'utf-8');
                        archive = JSON.parse(archive);

                        archive.push(threadsFile.pop());
                        fs.writeFileSync(path.resolve(archivePath, fileName), JSON.stringify(archive), 'utf-8');

    
                    // file does not exist yet
                    } else {

                        let oldThread = threadsFile.pop();
                        let archive = `[${JSON.stringify(oldThread)}]`;
                        fs.writeFileSync(path.resolve(archivePath, fileName), archive, 'utf-8');
                    }

                   
                }

                fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'boards', req.body.board, 'threads.json'), JSON.stringify(threadsFile), 'utf-8');

                postsTrackFile[req.body.board] = newPostID;
                fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'num_of_posts.json'), JSON.stringify(postsTrackFile), 'utf-8');
                
                res.redirect('/board/' + req.body.board);


            // REPLY type
            } else if (req.body['post-type'] === 'REPLY') {

                newPost = {
                    type: "REPLY",
                    id: newPostID,
                    unix: time.getTime(),
                    body: 
                    {
                        username: req.body.username,
                        content: req.body.content 
                    }
                }

                threadsFile = JSON.parse(threadsFile);

                // find parent thread
                for (let index in threadsFile) {
                    // string or number, doesn't matter
                    if (threadsFile[index].id == req.body['parent-thread']) {
                        threadsFile[index].replies.push(newPost);
                        break;
                    }
                }
                
                fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'boards', req.body.board, 'threads.json'), JSON.stringify(threadsFile), 'utf-8');

                postsTrackFile[req.body.board] = newPostID;
                fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'num_of_posts.json'), JSON.stringify(postsTrackFile), 'utf-8');
                
                res.redirect('/board/' + req.body.board);



            } else {
                res.status(400).header( {'content-type': 'text/plain' } ).send('Invalid POST format, how did you get past my first validator?');
                return;
            }
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