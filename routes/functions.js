var createError = require('http-errors');
const { baseUrl, getAuthToken } = require("./auth");

/**
 * Get data from Kazoo.
 * @param {string} folder Data source requesting from Kazoo - i.e. /users/{{user id}}.
 * @param {string} accountId Account ID for the requested data.
 * @param {function} next Pass next from the router.
 * @returns Actual data requested.
 */
async function getKazooData(folder, accountId, next) {
    await getAuthToken(next);
    try {
        const response = await fetch(`${baseUrl}accounts/${accountId}/${folder}`, { method: "GET", headers: { "Content-Type": "application/json", "X-Auth-Token": global.authToken } });
        const responseJson = await response.json();
        return responseJson.data;
    } catch (error) {
        next(createError(error));
    }
}

/**
 * Update data in Kazoo, POST request to Kazoo.
 * @param {string} folder Data source requesting from Kazoo - i.e. /users/{{user id}}.
 * @param {string} accountId Account ID for the requested data.
 * @param {object} bodyObj Request JSON body as an object.
 * @param {function} next Pass next from the router.
 */
async function postKazooData(folder, accountId, bodyObj, next) {
    await getAuthToken(next);
    try {
        const response = await fetch(`${baseUrl}accounts/${accountId}/${folder}`, { method: "POST", headers: { "Content-Type": "application/json", "X-Auth-Token": global.authToken }, body: JSON.stringify(bodyObj) });
        if (response.status >= 400) {
            next(createError(response.status));
        }
    } catch (error) {
        next(createError(error));
    }
}

//callflow actions

/**
 * Callflow Text to Speech module.
 * @param {string} text The text to announce to the caller.
 * @param {object} children Child Callflow actions.
 * @returns Callflow object.
 */
function cfTts(text, children) {
    retVal = {
        module: "tts",
        data: {
            text: text
        }
    }

    if (children) {
        retVal.children = {
            _: children
        }
    }

    return retVal;
}

/**
 * Callflow collect DTMF module.
 * @param {string} collection_name Variable for the collected DTMF to be stored in.
 * @param {number} max_digits Maximum digits to collect,when max is reached it will go right away to the next child and not wait for more digits.
 * @param {object} children Child Callflow actions.
 * @returns Callflow object.
 */
function cfCollectDtmf(collection_name, max_digits = 11, children = {}) {
    return {
        data: {
            interdigit_timeout: 2000,
            collection_name: collection_name,
            max_digits: max_digits,
            terminator: "#",
            timeout: 10000
        },
        module: "collect_dtmf",
        children: {
            _: children
        }
    }
}

/**
 * Callflow Pivot module.
 * @param {string} method The method to use, options are "get" or "post"
 * @param {string} voice_url The URL (with protocol without folder) to send the request, if left blank it will use the URL of the request.
 * @param {req} req To use the URL of the request, forward the req.
 * @param {string} folder The folder after the URL.
 * @returns Callflow object.
 */
function cfPivot(method, voice_url = null, req, folder) {
    return {
        module: "pivot",
        data: {
            method: method,
            req_timeout: "10",
            req_format: "kazoo",
            voice_url: `${voice_url || `${req.protocol}://${req.get('host')}`}/${folder ? folder : ""}`,
            debug: true
        }
    }
}

/**
 * Callflow Set Custom Application Variables module.
 * @param {object} cavObject Custom Application Variables, to be retrieved later, {varName: value, foo: bar}.
 * @param {object} children Child Callflow actions.
 * @returns Callflow object.
 */
function cfSetCav(cavObject, children) {
    return {
        module: "set_variables",
        data: {
            custom_application_vars: cavObject
        },
        children: {
            _: children
        }
    }
}

/**
 * Callflow DISA module.
 * @param {boolean} use_account_caller_id true: use account caller ID, false: use caller's or specified caller ID,
 * @returns Callflow object.
 */
function cfDisa(use_account_caller_id) {
    return {
        module: "disa",
        data: {
            enforce_call_restriction: true,
            max_digits: 15,
            preconnect_audio: "dialtone",
            retries: 3,
            ring_repeat_count: 1,
            use_account_caller_id: use_account_caller_id
        }
    }
}

/**
 * Callflow Dynamic Caller ID module.
 * @param {string} cidName Caller ID name to show.
 * @param {string} cidNumber Caller ID number to show.
 * @param {object} children Child Callflow actions.
 * @returns Callflow object.
 */
function cfDynamicCid(cidName, cidNumber, children) {
    return {
        module: "dynamic_cid",
        data: {
            action: "static",
            caller_id: {
                name: cidName,
                number: cidNumber
            },
            "enforce_call_restriction": true
        },
        children: {
            _: children
        }
    }
}


module.exports = { getKazooData, cfTts, cfCollectDtmf, cfPivot, cfSetCav, postKazooData, cfDynamicCid, cfDisa };