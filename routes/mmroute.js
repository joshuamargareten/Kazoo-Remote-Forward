var express = require('express');
const { cfTts, postKazooData, getKazooData, cfPivot, cfDisa, cfDynamicCid, cfCollectDtmf } = require('./functions');
const { wLogger } = require('./logger');
var router = express.Router();

router.post('/', async function (req, res, next) {

    const accountId = req.body['Account-ID'];
    const userId = req.body['Custom-Application-Vars[userId]'];
    const mailboxId = req.body['Custom-Application-Vars[mailboxId]'];
    const user = await getKazooData(`users/${userId}`, accountId, next);
    const account = await getKazooData('', accountId, next);

    const selected = req.body['Digits[mainMenu]'];

    switch (selected) {
    case '1':
        wLogger.info(`User ${userId} from account ${accountId} selected 1 to toggle forwarding`);
        //flip call forward status
        user.call_forward.enabled = !user.call_forward.enabled;
        //update Kazoo with the new toggled status
        await postKazooData(`users/${userId}`, accountId, { data: user }, next);
        //return to main menu where it will announce the new status
        res.json(cfPivot('post', null, req, 'main'));
        break;

    case '2':
        wLogger.info(`User ${userId} from account ${accountId} selected 2 to update number`);
        //prompt to enter the new call forward number
        res.json(
            cfTts(
                'Please enter the number where you want to forward your calls. to use the number you are calling from, press pound.',
                cfCollectDtmf(
                    'fwdNumber',
                    11,
                    cfPivot(
                        'post',
                        null,
                        req,
                        'confirmnumber'
                    )
                )
            )
        );
        break;

    case '3':
        wLogger.info(`User ${userId} from account ${accountId} selected 3 to change settings`);
        //redirect to the settings menu
        res.json(cfPivot('post', null, req, 'settingsmenu'));
        break;

    case '4':
        //check if user has specified a CID for their extension, yes: set CID to that and DISA, no: use account CID in disa
        if (user.caller_id.external && user.caller_id.external.number) {
            const cidName = user.caller_id.external.name ? user.caller_id.external.name : account.caller_id.external.name;
            wLogger.info(`User ${userId} from account ${accountId} selected 4 for disa, cid: ${cidName} ${user.caller_id.external.number}`);
            res.json(
                cfTts(
                    `Caller ID will show ${user.caller_id.external.number.split('')}`,
                    cfDynamicCid(
                        cidName,
                        user.caller_id.external.number,
                        cfDisa(false)
                    )
                )
            );
        } else {
            wLogger.info(`User ${userId} from account ${accountId} selected 4 for disa, cid: ${account.caller_id.external.number}`);
            res.json(
                cfTts(
                    `Caller ID will show ${account.caller_id.external.number.split('')}`,
                    cfDisa(true)
                )
            );
        }
        break;

    case '5':
        wLogger.info(`User ${userId} from account ${accountId} selected 5 for voicemail`);
        //Direct to voicemail for that user
        res.json(
            {
                module: 'voicemail',
                data: {
                    action: 'check',
                    id: mailboxId
                }
            }
        );
        break;

    default:
        res.json(cfPivot('post', null, req, 'main'));
        break;
    }
});

module.exports = router;
