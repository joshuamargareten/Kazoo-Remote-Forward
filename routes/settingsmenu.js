var express = require('express');
const { cfTts, cfCollectDtmf, cfPivot, getKazooData } = require('./functions');
var router = express.Router();

router.post('/', async function (req, res, next) {
    const accountId = req.body['Account-ID'];
    const userId = req.body['Custom-Application-Vars[userId]'];
    const user = await getKazooData(`users/${userId}`, accountId, next);

    //Set greeting options based on current status

    const ringTo1 = user.call_forward.substitute ? 'only to the forwarded number' : 'also to the deskphone';
    const ringTo0 = user.call_forward.substitute ? 'also to the deskphone' : 'only to the forwarded number';

    const reqPress1 = user.call_forward.require_keypress ? 'required' : 'not required';
    const reqPress0 = user.call_forward.require_keypress ? 'not required' : 'required';

    const cid1 = user.call_forward.keep_caller_id ? 'caller\'s' : 'company\'s';
    const cid0 = user.call_forward.keep_caller_id ? 'company\'s' : 'caller\'s';

    const directAll1 = user.call_forward.direct_calls_only ? 'only calls direct to your extension' : 'all calls';
    const directAll0 = user.call_forward.direct_calls_only ? 'all calls' : 'only calls direct to your extension';

    //respond to the caller with menu options
    res.json(
        cfTts(
            `Calls are currently ringing ${ringTo1}, to change to ring ${ringTo0}: press 1. Calls are currently ${reqPress1} to press 1 to answer the call, to change to ${reqPress0}: press 2, when not required voicemails will be sent to the forwarded number's mailbox. Calls are currently showing the ${cid1} number, to change to show the ${cid0} number: press 3. currently ${directAll1} are being forwarded. to change to ${directAll0} to be forwarded: press 4., to return to the previous menu: press the star key.`,
            cfCollectDtmf(
                'settingsSelection',
                1,
                cfPivot('post', null, req, 'settingsslct')
            )
        )
    );
});

module.exports = router;