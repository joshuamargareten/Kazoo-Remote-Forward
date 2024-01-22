var express = require('express');
const { getKazooData, cfTts, cfCollectDtmf, cfPivot } = require('./functions');
var router = express.Router();

router.post('/', async function (req, res, next) {

    const accountId = req.body['Account-ID'];
    const userId = req.body['Custom-Application-Vars[userId]'];

    const user = await getKazooData(`users/${userId}`, accountId, next);

    //Announce to the caller current status and menu options
    let menuGreeting;
    if (user.call_forward.enabled) {
        menuGreeting = `Call forwarding is now enabled, to number: ${user.call_forward.number.split('')}, to turn off call forwarding: press 1, to change call forwarding number: press 2, to update call forwarding settings: press 3, `;
    } else {
        menuGreeting = 'Call forwarding is now disabled, to turn on call forwarding: press 1, ';
    }
    menuGreeting += 'to place a call: press 4, to listen to your voicemails: press 5.';

    res.json(
        cfTts(
            menuGreeting,
            cfCollectDtmf(
                'mainMenu',
                1,
                cfPivot(
                    'post',
                    null,
                    req,
                    'mmroute'
                )
            )
        )
    );
});

module.exports = router;
