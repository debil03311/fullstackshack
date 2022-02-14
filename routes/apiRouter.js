const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// example of query search
router.get('/chatlog/query', (req, res) => {

    const queryReq = req.query;

    if (Object.keys(queryReq).length > 0) {

        fs.readFile(
            path.resolve(__dirname, '..', 'public', 'chatLog.json'),
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

// export router
module.exports = router;