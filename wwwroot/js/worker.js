var msg = {
    action: "",
    str: "",
    data: {}
};
var reqs = [];
onmessage = async function (e) {
    var _msg = e.data[0];
    if (_msg.action == "upload") {
        if (_msg.data.signal == "abort") {
            upload_abort(_msg.data.i);
        } else {
            upload(_msg.data.url, _msg.data.data, _msg.data.fkey, _msg.data.key, _msg.data.info);
        }
    } else if (_msg.action == "params_to") {
        let d = params_to(_msg.data.d, _msg.data.id, _msg.data.user_key, _msg.data.sep, _msg.data.res);
        msg.action = "params_to";
        msg.data = {
            res: _msg.data.res,
            fkey: _msg.data.fkey,
            key: _msg.data.key,
            d: d,
        };
        postMessage(msg);
    } else if (_msg.action == "consts_init") {
        msg.action = "consts_init";
        try{
            var res = await consts_init(_msg.data.url_server, _msg.data.id, _msg.data.user_key, _msg.data.token, _msg.data.sep, _msg.data.is_login);
            msg.data = res;
        }
        catch(ex) {
            console.log(ex);
            msg.str = ex;
            msg.data = null;
        }
        postMessage(msg);
    }
}

/**
 * XHR with progres bar. (need to develop)
 * 
 * @param {string} url
 * @param {string} data
 * 
 * @return {Promise<string>} response of server
 */
function upload(url, data, fkey, key, info) {
    let request;
    request = new XMLHttpRequest();
    request.open('POST', url);
    msg.action = "upload";
    msg.data = {
        signal: "start",
        fkey: fkey,
        i: reqs.length
    };
    postMessage(msg);
    reqs.push(request);
    request.upload.addEventListener('progress', function (e) {
        let percent_completed = parseInt((e.loaded / e.total) * 100);
        msg.action = "upload";
        msg.data = {
            signal: "progress",
            fkey: fkey,
            progress: percent_completed
        };
        postMessage(msg);
    });
    request.addEventListener('load', function (e) {
        // console.log("request.status: " + request.status);
        // console.log("request.response: " + request.response);
        msg.action = "upload";
        msg.data = {
            signal: "end",
            fkey: fkey,
            key: key,
            info: info,
            d: request.response,
        };
        postMessage(msg);
    });
    request.addEventListener('error', function (e) {
        console.log("error, request.status: " + request.status);
        msg.action = "upload";
        msg.data = {
            signal: "error",
            status: request.status,
            fkey: fkey
        };
        postMessage(msg);
    });
    request.addEventListener('abort', function (e) {
        console.log("aborted");
        msg.action = "upload";
        msg.data = {
            signal: "abort",
            fkey: fkey
        };
        postMessage(msg);
    });
    request.send(data);
}

/**
 * Aborts the upload
 *
 * @param {Number} i request index
 *
 * @return {void}
 */
function upload_abort(i) {
    let request = reqs[i];
    if (request == null) return;
    request.abort();
}

/**
 * Creates fetch parameter from form parameters and http headers
 *
 * @param {string} str input string, should be numeral
 *
 * @return {string} str with at least 2 digit length
 */
 function fetchd(data, id, token) {
    let f = {
        method: "POST",
        headers: {
            user_id: id,
            token: token,
        }
    };
    if (data && data != "") f.body = data;
    return f;
}

/**
 * Wraps xhr parameters in custom packet.
 *
 * All xhr parameters will be wrap as follow:
 * object->stringify->utf8_encode->to_base64->encrypt->to_base64
 *
 * @param {object} d parameters object.
 *
 * @return {string} server readable encrypted parameters.
 */
 function params_to(d) {
    if (!d) return "";
    d = utf8_encode(JSON.stringify(d));
    return d;
}

/**
 * Unwraps received data from server
 *
 * Received data from xhr will unwrap as follow:
 * from_base64->decrypt->from_base64->utf8_decode
 *
 * @param {string} d encrypted data from server.
 *
 * @return {string} plain stringified data
 */
 function params_from(d) {
    if (!d) return "";
    try {
        d = utf8_decode(d);
    } catch (ex) {}
    d = JSON.parse(d);
    try {
        d.data = JSON.parse(d.data);
    } catch (ex) {}
    return d;
}

/**
 * String utf8 decode
 *
 * @param {string} s any string
 *
 * @return {string} utf8 decoded string
 */
 function utf8_decode(s) {
    return decodeURIComponent(escape(s));
}

/**
 * String utf8 encode. 
 *
 * @param {string} s any string
 *
 * @return {string} utf8 encoded string
 */
function utf8_encode(s) {
    return unescape(encodeURIComponent(s));
}

// ====================================================

/**
 * Gets preferences, languages, modules and schema from server
 * 
 * @param {string} url_server the URL of server.
 * @param {string} id user id.
 * @param {string} key user key for encryption.
 * @param {string} token user token.
 * @param {string} sep separator.
 * @param {boolean} is_login separator.
 * 
 * @return {Promise<void>}
 */
async function consts_init(url_server, id, key, token, sep, is_login) {
    var d = {}, res = {};
    var res_byte, res_str;

    //get chats
    d = params_to({action: "chat_get"})
    res_byte = await fetch(url_server + "wind", fetchd(d, id, token));
    res_str = await res_byte.text();
    res.chats = params_from(res_str);

    //get contacts
    d = params_to({action: "contact_get"})
    res_byte = await fetch(url_server + "wind", fetchd(d, id, token));
    res_str = await res_byte.text();
    res.contacts = params_from(res_str);

    //get settings
    d = params_to({action: "user_get_settings"})
    res_byte = await fetch(url_server + "wind", fetchd(d, id, token));
    res_str = await res_byte.text();
    res.settings = params_from(res_str);

    //get_ preference
    d = params_to({action: "preference_get_"})
    res_byte = await fetch(url_server + "wind", fetchd(d, id, token));
    res_str = await res_byte.text();
    res.preference = params_from(res_str);

    return res;
}