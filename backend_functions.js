// custom middleware
const reqLog = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const time = new Date();
    console.log(`${method} ${url} ${time.getUTCHours()}:${time.getUTCMinutes()}`);

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