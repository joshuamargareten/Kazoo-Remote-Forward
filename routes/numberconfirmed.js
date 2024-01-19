var express = require('express');
const { postKazooData, getKazooData, cfPivot } = require('./functions');
var router = express.Router();


router.post('/', async function (req, res, next) {

    //if user confirms number is correct update the number in Kazoo and go back to main menu to announce updated info
    switch (req.body['Digits[confirmNumber]']) {
        case '1':
            const accountId = req.body['Account-ID'];
            const userId = req.body['Custom-Application-Vars[userId]'];
            const user = await getKazooData(`users/${userId}`, accountId, next);
            const number = req.body['Custom-Application-Vars[fwdNumber]'];
            user.call_forward.number = number;
            await postKazooData(`users/${userId}`, accountId, { data: user }, next)
            res.json(cfPivot("post", null, req, "main"));
            break;

        //If number is incorrect direct to re-enter the number
        case '2':
            res.json(cfPivot("post", null, req, "mmroute"));
            break;

        //if wrong selection or no selection repeat the current menu
        default:
            res.json(cfPivot("post", null, req, "confirmnumber"));
            break;
    }
});

module.exports = router;