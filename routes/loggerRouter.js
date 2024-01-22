var express = require('express');
const { wLogger } = require('./logger');
var router = express.Router();

router.use(function (req, res, next) {
    wLogger.http(`${req.method}, ${req.url}, ${JSON.stringify(req.body)},`);
    next();
});

module.exports = router;

