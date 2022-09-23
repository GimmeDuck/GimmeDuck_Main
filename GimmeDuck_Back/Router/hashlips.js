const express = require('express');
const router = express.Router();

const { startCreating, buildSetup } = require('../hashlips_art_engine/src/main.js');



router.route('/').get((req, res) => {
    (() => {
        buildSetup();
        startCreating();
    })();
    console.log(res);
    
});

module.exports = router;