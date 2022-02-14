const fs = require('fs');
const path = require('path');

function prefixZero(number) {
    number = parseInt(number);

    if (number < 10 && number > -1)
        number = "0" + number;

    return number;
}



// custom middleware
const reqLog = (req, res, next) => {
    const time = new Date();
    const method = req.method;
    const url = req.url;
    const ip = req.ip;

    console.log(`${ip} ${method} ${url} ${time.getUTCHours()}:${time.getUTCMinutes()}`);


    const fileName = `${time.getUTCFullYear()}${prefixZero(time.getUTCMonth() + 1)}${prefixZero(time.getUTCDate())}.json`;
    let internetEvent = {
        time: time,
        method: method,
        url: url,
        ip: ip,
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
        
        console.log('Does not exist');
        let data = `[${JSON.stringify(internetEvent)}]`;

        fs.writeFileSync(
            path.resolve(__dirname, 'traffic_log', fileName),
            data,
            'utf-8',
        );
    }
    


    // either pass the name of the next middleware, or leave it empty to resume original invoker
    next();
}

const timeLog = (message) => {
    const time = new Date();
    console.log(`${message} ${time}`);
}



module.exports = {
    reqLog,
    timeLog,
};


