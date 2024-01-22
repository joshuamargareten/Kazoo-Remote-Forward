var express = require('express');
const { getKazooData, postKazooData, cfPivot } = require('./functions');
const { wLogger } = require('./logger');
var router = express.Router();

router.post('/', async function (req, res, next) {

    const accountId = req.body['Account-ID'];
    const userId = req.body['Custom-Application-Vars[userId]'];
    const user = await getKazooData(`users/${userId}`, accountId, next);

    //Per menu selected toggle the setting, update kazoo, and return to previous menu to announce current/ new statuses
    switch (req.body['Digits[settingsSelection]']) {
    case '1':
        wLogger.info(`User ${userId} from account ${accountId} selected 1 to toggle substitute`);
        user.call_forward.substitute = !user.call_forward.substitute;
        await postKazooData(`users/${userId}`, accountId, { data: user }, next);
        res.json(cfPivot('post', null, req, 'settingsmenu'));
        break;

    case '2':
        wLogger.info(`User ${userId} from account ${accountId} selected 2 to toggle require_keypress`);
        user.call_forward.require_keypress = !user.call_forward.require_keypress;
        await postKazooData(`users/${userId}`, accountId, { data: user }, next);
        res.json(cfPivot('post', null, req, 'settingsmenu'));
        break;

    case '3':
        wLogger.info(`User ${userId} from account ${accountId} selected 3 to toggle keep_caller_id`);
        user.call_forward.keep_caller_id = !user.call_forward.keep_caller_id;
        await postKazooData(`users/${userId}`, accountId, { data: user }, next);
        res.json(cfPivot('post', null, req, 'settingsmenu'));
        break;

    case '4':
        wLogger.info(`User ${userId} from account ${accountId} selected 4 to toggle direct_calls_only`);
        user.call_forward.direct_calls_only = !user.call_forward.direct_calls_only;
        await postKazooData(`users/${userId}`, accountId, { data: user }, next);
        res.json(cfPivot('post', null, req, 'settingsmenu'));
        break;

    case '*':
        wLogger.info(`User ${userId} from account ${accountId} selected * to return to main menu`);
        res.json(cfPivot('post', null, req, 'main'));
        break;

    default:
        res.json(cfPivot('post', null, req, 'settingsmenu'));
        break;
    }

});

module.exports = router;
