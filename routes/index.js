var express = require('express');
var router = express.Router();
var extensionRouter = require('./extension');
var mainRouter = require('./main');
var mmrouteRouter = require('./mmroute');
var confirmnumberRouter = require('./confirmnumber');
var numberconfirmedRouter = require('./numberconfirmed');
var settingsmenuRouter = require('./settingsmenu');
var settingsslctRouter = require('./settingsslct');
const { cfTts, cfCollectDtmf, cfPivot } = require('./functions');
const { wLogger } = require('./logger');

router.use('/extension', extensionRouter);
router.use('/main', mainRouter);
router.use('/mmroute', mmrouteRouter);
router.use('/confirmnumber', confirmnumberRouter);
router.use('/numberconfirmed', numberconfirmedRouter);
router.use('/settingsmenu', settingsmenuRouter);
router.use('/settingsslct', settingsslctRouter);

//Main greeting, prompting for extension and pin
router.use('/', function (req, res, next) {
    wLogger.info('Welcoming user');
    res.json(
        cfTts(
            'Welcome! Please enter your extension number, then press pound.',
            cfCollectDtmf(
                'extension', 5,
                cfTts(
                    'Please enter your voicemail pin, then press pound.',
                    cfCollectDtmf(
                        'password', 8,
                        cfPivot(
                            'post', null, req, 'extension'
                        ))
                )
            )
        )
    );
});

module.exports = router;
