const express = require('express');
const fs = require('fs');
const { Agent } = require('http');
const path = require('path');

const app = express();



function prefixZero(number) {
    number = parseInt(number);

    if (number < 10 && number > -1)
        number = "0" + number;

    return number;
}



// custom middleware

const cookieCheck = (req, res, next) => {

    const time = Date.now();
    req.time = time;

    // new user
    if (Object.keys(req.cookies).length === 0) {

        const newCookie = {
            user: `${req.time}`,
            ip: req.ip,
            user_agent: req.headers['user-agent'],
        };

        // send permament cookie to new user
        res.cookie("user", newCookie.user);

        fs.writeFileSync(path.resolve(__dirname, 'traffic_log', 'cookies', `${newCookie.user}.json`), JSON.stringify(newCookie), 'utf-8');
        req.user = newCookie.user;
        next();

    } else {

        // check for cookie forgery attemps
        fs.readFile(path.resolve(__dirname, 'traffic_log', 'cookies', `${req.cookies.user}.json`), 'utf-8', (err, data) => {
            if (err) {
                console.log(`Attempted forgery detected from ${req.ip}`);
                res.status(401).header( {'content-type': 'text/plain'} ).send('Forging cookies are we?');
                return;
            }
            
            req.user = req.cookies.user;
            next();
        });
    }
}




const reqLog = (req, res, next) => {
    
    const fileTime = new Date();
    console.log(`${req.ip} ${req.method} ${req.url} ${fileTime.getUTCHours()}:${fileTime.getUTCMinutes()}`);

    const fileName = `${fileTime.getUTCFullYear()}${prefixZero(fileTime.getUTCMonth() + 1)}${prefixZero(fileTime.getUTCDate())}.json`;
    let internetEvent = {
        time: req.time,
        method: req.method,
        url: req.url,
        user: req.user,
    };

    // the logging process needs to be in sync!

    // case in which the file does exist
    if (fs.existsSync(path.resolve(__dirname, 'traffic_log', fileName))) {
        
        let data = fs.readFileSync(
            path.resolve(__dirname, 'traffic_log', fileName),
            'utf-8',
        );

        data = JSON.parse(data);
        data.push(internetEvent);
        data = JSON.stringify(data);

        fs.writeFileSync(
            path.resolve(__dirname, 'traffic_log', fileName),
            data,
            'utf-8',
        );

        
    // case in which the file does exist
    } else {
        
        let data = `[${JSON.stringify(internetEvent)}]`;

        fs.writeFileSync(
            path.resolve(__dirname, 'traffic_log', fileName),
            data,
            'utf-8',
        );
    }
    
    next();
}






module.exports = {
    reqLog,
    cookieCheck,
};


