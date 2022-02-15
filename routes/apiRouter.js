const express = require('express');
const { route } = require('express/lib/application');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// example of query search
router.get('/chatlog/query', (req, res) => {

    const queryReq = req.query;

    if (Object.keys(queryReq).length > 0) {

        fs.readFile(
            path.resolve(__dirname, '..', 'public', 'src', 'chatLog.json'),
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
        );

    // if query is empty    
    } else {
        res.status(404).header( {'content-type': 'text/plain'} ).send('Query request cannot be empty');
    }
});


router.get('/boards', (req, res) => {

    const dirArray = fs.readdirSync(path.resolve(__dirname, '..', 'public', 'boards'));
    res.status(200).header( {'content-type': 'application/json' } ).send(dirArray);
});


router.get('/:board/page/:num', (req, res) => {

    const params = req.params;
    let result = [];

    fs.readFile(
        path.resolve(__dirname, '..', 'public', 'boards', params.board, 'threads.json'),
        'utf-8',
        (err, data) => {
            if (err) {
                res.status(404).header( {'content-type': 'text/plain' } ).send('Board does not exist');
                return;
            }

            data = JSON.parse(data);
            for (let i = (params.num - 1) * 10; i < (params.num * 10); i++) {
                result.push(data[i]);
            }

            res.status(200).header( {'content-type': 'application/json' } ).send(result);
        }
    );
    
});


router.get('/:board/post/:num', (req, res) => {

    const params = req.params;
    
    if (isNaN(Number(params.num))) {
        res.status(404).header( {'content-type': 'text/plain' } ).send('Invalid format for post ID, input a positive integer');
        return;
    }

    fs.readFile(
        path.resolve(__dirname, '..', 'public', 'boards', params.board, 'threads.json'),
        'utf-8',
        (err, data) => {
            if (err) {
                res.status(404).header( {'content-type': 'text/plain' } ).send('Board does not exist');
                return;
            }
            data = JSON.parse(data);

            // check the current N active thread IDs (string or number)
            for (let thread of data) {
                if (thread.id == params.num) {
                    res.status(200).header( {'content-type': 'application/json' } ).send(thread);
                    return;
                }
            }

            // check for post ID in every thread's replies array
            for (let thread of data) {
                for (let post of thread.replies) {
                    if (post.id == params.num) {
                        res.status(200).header( {'content-type': 'application/json' } ).send(post);
                        return;
                    }
                }
            }

            // if there is no active post with this ID
            res.status(404).header( {'content-type': 'text/plain' } ).send('Post could not be found');

        }
    );


});

// if the user requested anything else from API, send error
router.get('/*', (req, res) => {
    res.status(404).header( {'content-type': 'text/plain' } ).send('Invalid use of API');
});


// export router
module.exports = router;