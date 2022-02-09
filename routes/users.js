const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    
    res.sendFile('C:\\Users\\stranger\\Documents\\Theory\\JavaScript_tutorial\\FirstWebsite\\views\\hello.txt');
});

router.get('/new', (req, res) => {
    res.sendFile('C:\\Users\\stranger\\Documents\\Theory\\JavaScript_tutorial\\FirstWebsite\\views\\test.html');
});

module.exports = router;