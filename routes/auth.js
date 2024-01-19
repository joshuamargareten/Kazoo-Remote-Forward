var createError = require('http-errors');
const baseUrl = process.argv[3] || "https://ui.zswitch.net/v2/";
const api_key = process.argv[2];

/**
 * Get Auth Token from Kazoo
 * @param {function} next Pass next from the router.
 */
async function getAuthToken(next) {
    try {
        let response = await fetch(`${baseUrl}about`, { method: "GET", headers: { "Content-Type": "application/json", "X-Auth-Token": global.authToken } });
        if (response.status === 401) {
            try {
                let response = await fetch(`${baseUrl}api_auth`, { method: "PUT", headers: { "Content-Type": "application/json"}, body: JSON.stringify({data: {api_key: api_key}}) });
                let responseJson = await response.json()
                global.authToken = responseJson.auth_token;
            } catch (error) {
                next(createError(error));
            }
        }
    } catch (error) {
        next(createError(error));
    }
}

module.exports = {baseUrl, getAuthToken};