var express = require('express');
const { getKazooData, cfTts, cfPivot, cfSetCav } = require('./functions');
const { wLogger } = require('./logger');
var router = express.Router();

router.post('/', async function (req, res, next) {

    //Get all users for this account
    const users = await getKazooData('users', req.body['Account-ID'], next);
    const reqExt = req.body['Digits[extension]'];
    let user;
    //Loop through the users and find a user with presence_id equals to the extension number entered
    for (let i = 0; i < users.length; i++) {
        if (users[i].presence_id == reqExt) {
            user = users[i];
        }
    }
    if (user) {
        //Get users mailbox and match pins
        const mailboxes = await getKazooData(`vmboxes?filter_owner_id=${user.id}`, req.body['Account-ID'], next);
        if (mailboxes[0]) {
            const response = await getKazooData(`vmboxes/${mailboxes[0].id}`, req.body['Account-ID'], next);
            const pin = response.pin || '';
            if (pin == req.body['Digits[password]']) {
                //if correct respond to the caller with welcome and route to the main menu
                wLogger.info(`Welcoming ${user.first_name} ${user.last_name} from account ${req.body['Account-ID']}`);
                res.json(
                    cfTts(
                        `Welcome ${user.first_name} ${user.last_name}!`,
                        cfSetCav(
                            { userId: user.id, mailboxId: mailboxes[0].id },
                            cfPivot(
                                'post',
                                null,
                                req,
                                'main'
                            )
                        )
                    )
                );
            } else {
                //if incorrect pin ask up to 3 time to re-enter
                wLogger.info('entered incorrect pin');
                const attempts = parseInt(req.body['Custom-Application-Vars[pinAttempts]']) || 1;
                if (attempts > 3) {
                    res.json(cfTts('Login incorrect.'));
                } else {
                    res.json(
                        cfSetCav(
                            { pinAttempts: attempts + 1 },
                            cfTts(
                                'The password you entered seems to be incorrect please try again.',
                                cfPivot('get', null, req)
                            )
                        )
                    );
                }
            }
        }
    } else {
        //if no extension was found, the presence_id might not be set to that extension (when moving the extension to callflows for additional settings) or they mis entered it or they have more then 1 extension and entered the one not the presence_id
        wLogger.info('User not found');
        res.json(cfTts('We couldn\'t find the user for that extension number, please contact your admin to ensure that your presents ID is properly set up.'));
    }

});

module.exports = router;
