var express = require('express');
const { getKazooData, postKazooData, cfPivot } = require('./functions');
var router = express.Router();

router.post('/', async function (req, res, next) {

    const accountId = req.body['Account-ID'];
    const userId = req.body['Custom-Application-Vars[userId]'];
    const user = await getKazooData(`users/${userId}`, accountId, next);

    //Per menu selected toggle the setting, update kazoo, and return to previous menu to announce current/ new statuses
    switch (req.body['Digits[settingsSelection]']) {
        case '1':
            user.call_forward.substitute = !user.call_forward.substitute;
            await postKazooData(`users/${userId}`, accountId, { data: user }, next)
            res.json(cfPivot("post", null, req, "settingsmenu"));
            break;

        case '2':
            user.call_forward.require_keypress = !user.call_forward.require_keypress;
            await postKazooData(`users/${userId}`, accountId, { data: user }, next)
            res.json(cfPivot("post", null, req, "settingsmenu"));
            break;

        case '3':
            user.call_forward.keep_caller_id = !user.call_forward.keep_caller_id;
            await postKazooData(`users/${userId}`, accountId, { data: user }, next)
            res.json(cfPivot("post", null, req, "settingsmenu"));
            break;

        case '4':
            user.call_forward.direct_calls_only = !user.call_forward.direct_calls_only;
            await postKazooData(`users/${userId}`, accountId, { data: user }, next)
            res.json(cfPivot("post", null, req, "settingsmenu"));
            break;

        case '*':
            res.json(cfPivot("post", null, req, "main"));
            break;

        default:
            res.json(cfPivot("post", null, req, "settingsmenu"));
            break;
    }

});

module.exports = router;
