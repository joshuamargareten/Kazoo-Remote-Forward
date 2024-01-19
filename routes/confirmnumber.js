var express = require('express');
const { cfTts, cfCollectDtmf, cfPivot, cfSetCav } = require('./functions');
var router = express.Router();

router.post('/', function (req, res, next) {
    //Update call forward number, confirm to the caller we got the correct number
    const number = req.body['Digits[fwdNumber]'] ? req.body['Digits[fwdNumber]'] : req.body["Caller-ID-Number"];
    res.json(
        cfTts(
            `I got ${number.split("")}, if this is correct: press 1, to try again: press 2.`,
            cfSetCav(
                { fwdNumber: number },
                cfCollectDtmf(
                    "confirmNumber",
                    1,
                    cfPivot(
                        "post",
                        null,
                        req,
                        "numberconfirmed"
                    )
                )
            )
        )
    )
});

module.exports = router;