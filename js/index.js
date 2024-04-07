//#region global functions(tools)

/**
 * minifies document.querySelector
 *
 * @param {string} x element selector.
 *
 * @return {Element?} element.
 */
function $(x) {
    if (x == undefined) return null;
    return document.querySelector(x);
}

/**
 * minifies document.querySelectorAll
 *
 * @param {object} obj xhr parameters as an object.
 *
 * @return {Element[]} stringified parameters.
 */
function $$(x) {
    if (x == undefined) return [];
    return document.querySelectorAll(x);
}

/**
 * Gets an item from cookies with a key
 *
 * @param {string} name cookie name
 *
 * @return {string?} either cookie value or null
 */
function cookie_get(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Sets an item to cookies with a key, value and expire days
 *
 * @param {string} name cookie name
 * @param {object} value cookie value
 * @param {number} days cookie expire in day
 *
 * @return {string?} either cookie value or null
 */
function cookie_set(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function cookie_delete(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

/**
 * Waits for a certain time.
 *
 * @param {string} delay waiting time in ms
 *
 * @return {Promise<void>} returns after delay
 */
function wait(delay) {
    return new Promise(resolve => {
        setTimeout(function () {
            resolve();
        }, delay);
    });
}

/**
 * Remove an item from array
 *
 * @param {object} array
 * @param {object} item the item to remove from array
 *
 * @return {void}
 */
function array_remove(array, item) {
    if (!array || typeof array != "object") return;
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

/**
 * Stringifies object with ';' delimiter.
 *
 * converts {data_1: "d1", data_2:"d2"} to "data_1:d1;data_2:d2".
 *
 * @param {object} obj xhr parameters as an object.
 *
 * @return {string} stringified parameters.
 */
function object_to_param_string(obj) {
    if (typeof obj == "string") return obj;
    return Object.keys(obj).reduce(function (str, key, i) {
        var delimiter, val;
        delimiter = (i === 0) ? '' : scope.sep;
        key = (key);
        if (obj[key] == undefined || obj[key] == null) {
            val = '';
        } else if (typeof obj[key] == "object") {
            val = (JSON.stringify(obj[key]));
        } else {
            val = (obj[key]);
        }
        return [str, delimiter, key, ':', val].join('');
    }, '');
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

    params_from_handle_code(d);
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
 function params_from_handle_code(d) {
    if (d && d.code == 301) {
        // loading(true);
        window.onbeforeunload = null;
        window.location.href = d.data;
    }
    if (d && d.code == 302) {
        // loading(true);
        window.onbeforeunload = null;
        logout(500);
    }
    if (d && d.code == 303) {
        // loading(true);
        window.onbeforeunload = null;
        window.location.href = window.location.href;
    }
}

/**
 * Removes any character other than digits from number
 *
 * For example converts 132,154 to 132154
 *
 * @param {number|string} dirty_num number with non digit characters
 *
 * @return {number} raw number
 */
function dirty_num_to_num(dirty_num) {
    //
    var str_ = "";
    dirty_num = dirty_num.toString();
    for (var i = 0; i < dirty_num.length; i++) {
        dirty_num = dirty_num.replace(" ", "");
        if (dirty_num[i] == '.' || !isNaN(dirty_num[i])) str_ += dirty_num[i];
    }
    if (str_ == "") return "";
    return Number(str_);
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
 * Shows loading for a specific section, or the whole page.
 *
 * If key parameter be exist, then the little loading shows in front of section name in sidebar.
 * else main loading will be shown.
 * this function only adds/removes class to/from elements.
 *
 * @param {boolean} shows true to shows and false to hide loading
 * @param {string} key section key
 *
 * @return {void}
 */
function loading(show, key) {
    if (key != undefined) {
        if ($("#loading_" + key)) {
            if (show == false) {
                $("#loading_" + key).classList.remove("true");
            } else {
                $("#loading_" + key).classList.add("true");
            }
        }
        if ($("#loading__" + key)) {
            if (show == false) {
                $("#loading__" + key).classList.remove("rotate");
            } else {
                $("#loading__" + key).classList.add("rotate");
            }
        }
        return;
    }
    if (show == false) {
        $("#loading").classList.add("none");
        $("#loading").classList.remove("trans");
        return;
    }
    $("#loading").classList.add("trans");
    $("#loading").classList.remove("none");
}

/**
 * Hides skeleton loading
 *
 * @return {void}
 */
function skeleton_hide() {
    // return;
    setTimeout(function () {
        if ($("#skeleton"))
            $("#skeleton").classList.add("none");
    }, 250);
}

/**
 * Shows a toast message
 *
 * @param {string} msg shows in toast body
 * @param {number} type colorize toast for different type of messages
 * -1 is danger
 * 0 is warning or neutral
 * 1 is sucess
 *
 * @return {void} shows a toast in page
 */
function toast(msg, type = 0) {
    // clone node and set message
    clearTimeout(toast_timeout);
    var toast = $(".toast").cloneNode(true);
    toast.classList.remove("success");
    toast.classList.remove("error");
    if (type == 1) toast.classList.add("success");
    else if (type == -1) toast.classList.add("error");
    toast.querySelector(".toast_msg").innerText = msg;
    toast.querySelector(".close").addEventListener("click", toast_close);
    // append to document, then set top and right
    document.body.appendChild(toast);
    setTimeout(function () {
        var w = toast.getBoundingClientRect().width;
        toast.style.right = "calc(" + toast_right_true + "% - " + (w / 2) + "px)";
        toast.style.top = (_toast_h) + "em";
    }, 100);

    // calculate next toast top
    var h = toast.getBoundingClientRect().height / 16; //in em
    var _toast_h = toast_top;
    toast_top += (h + 1);
    //
    setTimeout(function () {
        toast.style.right = toast_right_default + "em";
    }, 6000);
    setTimeout(function () {
        document.body.removeChild(toast);
        if (_toast_h < toast_top) toast_top = _toast_h;
    }, 7000);
    toast_timeout = setTimeout(function () {
        toast_top = toast_top_default;
    }, 8000);
}

/**
 * Closes a toast message.
 *
 * @param {Number} toast_right_default from global var.
 *
 * @return {void} closes a toast in page
 */
function toast_close() {
    this.parentElement.style.right = toast_right_default + "em";
}

/**
 * Adds a 0 before string with lenght of 1 to make sure that minimum lenght of string is 2
 *
 * @param {string} str input string, should be numeral
 *
 * @return {string} str with at least 2 digit length
 */
function min2(str) { //
    if (str == undefined || str == null) return "";
    try {
        str = str.toString();
    } catch (x) {
        return "";
    }
    if (str.length == 1) return +"0" + str;
    return str;
}

/**
 * Creates fetch parameter from form parameters and http headers
 *
 * @param {string} str input string, should be numeral
 *
 * @return {string} str with at least 2 digit length
 */
function fetchd(data) {
    let f = {
        method: "POST",
    };
    if (data && data != "") f.body = object_to_param_string(data);
    return f;
}

async function fetch_(url, d) {
    var res = await fetch(url, d);
    res = await res.text();
    return res;
}

async function fetch__(url, d) {
    if (scope.is_sending) return;
    scope.is_sending = true;
    let res;
    try {
        res = await fetch_(url, d);
    }
    catch (ex) {
        toast(scope.lang.dictionary["Error while sending request; please check your network!"], -1);
        console.log("ev.message exception: " + ex.message);
        scope.is_sending = false;
        return;
    }
    res = params_from(res);
    scope.is_sending = false;
    return res;
}

/**
 * Removes last part of url to get base part of url;
 * For example converts a/b/c/d/ to a/b/c/ (removes d/)
 *
 * @param {string} str input string, should be numeral
 *
 * @return {string} base part of url
 */
function path_base(str) {
    let ret = '';
    var d = str.split("/");
    for (var i = 0; i < d.length - 1; i++)
        ret += d[i] + '/';
    return ret;
}

/**
 * This is where everything binds between html and js
 *
 * section and scope to bind data
 *
 * ev to bind events
 *
 * @return {void}
 */
function rvbind() {
    rivets.bind(document, {
        scope: scope,
        ev: ev,
        sections: sections
    });
}

/**
 * Inserts new_substr at start index of str
 *
 * @param {string} str
 * @param {number} start
 * @param {string} new_substr
 *
 * @return {string} base part of url
 */
function splice(str, start, new_substr) {
    return str.slice(0, start) + new_substr + str.slice(start);
}

/**
 * Embed key(from scope) in a str
 *
 * @param {string} str
 *
 * @return {string} base part of url
 */
function key_embed(str) {
    if (str == undefined || typeof str != "string" || str == "" || str.length < 25) {
        console.log("invalid data in embed key");
        return;
    }
    var res = str;
    res = splice(res, 6, scope.self.key[0]);
    res = splice(res, 8, scope.self.key[1]);
    res = splice(res, 9, scope.self.key[2]);
    res = splice(res, 11, scope.self.key[3]);
    res = splice(res, 15, scope.self.key[4]);
    res = splice(res, 17, scope.self.key[5]);
    res = splice(res, 19, scope.self.key[6]);
    res = splice(res, 25, scope.self.key[7]);
    return res;
}

/**
 * Encrypts a string with global key
 *
 * param key from scope var
 *
 * @param {string} data
 *
 * @return {string} base part of url
 */
function crypt(data) {
    if (data == null) {
        console.log("data == null");
        return null;
    }
    if (scope.self.key == undefined) {
        console.log("user hasn't key...");
        return null;
    }
    if (typeof data != "string") {
        console.log("typeof data != string, ");
        return null;
    }
    if (data == "") return "";
    var enc = "";
    for (var i = 0; i < data.length; i++) {
        enc += String.fromCharCode(data.charCodeAt(i) ^ scope.self.key.charCodeAt(i % scope.self.key.length));
    }
    return enc;
}

/**
 * Creates array of number(pages) for each section
 * based on skip and take. for example returns 2,3,4,5 or 1,2,3.
 *
 * Maximum count of pages is 5, so if pages be between 1 and n
 * then only the 5 page numbers will be return and page number 1 and
 * page number n, will be static in the html page (1...array...n).
 * Uses paginate_after_need and paginate_before_need functions.
 *
 * @param {string} key section key
 *
 * @return {number[]} array of number, contains pagination numbers
 */
function paginiation(key) {
    if (typeof key == "object")
        key = this.dataset.key;
    // console.log("rows_total: " + scope[key].rows_total);
    var n = parseInt((scope[key].rows_total - 1) / scope.preference_clients.take) + 1;
    if (isNaN(n)) return;
    scope[key].pages = [];
    scope[key].page = Number(scope[key].page);
    if (scope[key].page > n) {
        scope[key].page = 1;
    }

    if (scope[key].page > 3 && !paginate_before_need(n, scope[key].page))
        scope[key].pages.push(scope[key].page - 3);
    if (scope[key].page > 2 && ((paginate_before_need(n, scope[key].page) && scope[key].page - 2 != 1) || !paginate_before_need(n, scope[key].page)))
        scope[key].pages.push(scope[key].page - 2);
    if (scope[key].page > 1 && ((paginate_before_need(n, scope[key].page) && scope[key].page - 1 != 1) || !paginate_before_need(n, scope[key].page)))
        scope[key].pages.push(scope[key].page - 1);

    scope[key].pages.push(scope[key].page);

    if (scope[key].page <= n - 1 && ((paginate_after_need(n, scope[key].page) && scope[key].page + 1 != n) || !paginate_after_need(n, scope[key].page)))
        scope[key].pages.push(scope[key].page + 1);
    if (scope[key].page <= n - 2 && ((paginate_after_need(n, scope[key].page) && scope[key].page + 2 != n) || !paginate_after_need(n, scope[key].page)))
        scope[key].pages.push(scope[key].page + 2);
    if (scope[key].page < n - 3 && !paginate_after_need(n, scope[key].page))
        scope[key].pages.push(scope[key].page + 3);

    scope[key].page_count = n;
    return scope[key].pages;
}

/**
 * Checks if needed to add a page before current page of pagination or not.
 *
 * @param {number} n number of pages
 * @param {number} scope_page current page number of paginitaion
 *
 * @return {boolean} true/false
 */
function paginate_after_need(n, scope_page) {
    if (n > 3 && scope_page <= n - 2)
        return true;
    return false;
}

/**
 * Checks if needed to add a page after current page of pagination or not.
 *
 * @param {number} n number of pages
 * @param {number} scope_page current page number of paginitaion
 *
 * @return {boolean} true/false
 */
function paginate_before_need(n, scope_page) {
    if (n > 3 && scope_page > 2)
        return true;
    return false;
}

/**
 * Reads file bytes as data url (async)
 *
 * @param {File} file
 *
 * @return {Promise<string>} base64 string data file
 */
async function file_to_base64(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        }
        reader.onerror = function (error) {
            resolve(error);
        }
    });
}

/**
 * @typedef {Object} file_result
 * @property {string} title name of file
 * @property {string} src data url of file
 * @property {string} type type of file
 */
/**
 * Reads files data, name and type(async).
 *
 * If multiple be true, reads all files
 * else reads the first file.
 *
 * @param {File[]} files
 * @param {bool[]} multiple
 *
 * @return {Promise<file_result[]>} base64 string data file
 */
async function get_uploading_files(files) {
    let res = [];
    for (let i = 0; i < files.length; i++) {
        let res_i = await file_to_base64(files[i]);
        res.push({
            title: files[i].name,
            src: res_i,
            type: files[i].type,
            size: files[i].size
        });
    }
    return res;
}

/**
 * Checks value is undefined or not
 *
 * @param {Object} x
 *
 * @return {boolean} true/false
 */
function _true(x) {
    var ret = x !== undefined;
    return ret;
}

/**
 * Checks value is true or checked
 *
 * @param {Object} val
 *
 * @return {boolean} true/false
 */
function chk_val(val) {
    if (val.toString() == 'true' || val.toString() == 'True' || val.toString() == 'checked')
        return true;
    return false;
}

/**
 * Checks value is exist in array or not
 *
 * @param {any} x
 * @param {any[]} arr
 *
 * @return {boolean} true/false
 */
function is_in(x, arr) {
    for (var i = 0; i < arr.length; i++)
        if (x == arr[i])
            return true;
    return false;
}

/**
 * Validates input by checking length
 *
 * @param {string} input
 *
 * @return {boolean} true/false
 */
function validate_required(input) {
    if (input == null || input == undefined || input === "" || input === {}) return false;
    return true;
}

/**
 * Validates input by checking length or value
 *
 * @param {string} input
 *
 * @return {boolean} true/false
 */
function validate_min(input, min) {
    min = parseFloat(min);
    if (typeof input == "bigint" && input <= min) return false;
    if (typeof input == "number" && input <= min) return false;
    if (typeof input == "string" && input.length <= min) return false;
    if (typeof input == "object" && input.length <= min) return false;
    return true;
}

/**
 * Validates input by checking value
 *
 * @param {string} input
 *
 * @return {boolean} true/false
 */
function validate_regex(input, regex) {
    var re = new RegExp(regex);
    return re.test(input);
}

/**
 * Validates input by checking length or value
 *
 * @param {string} input
 *
 * @return {boolean} true/false
 */
function validate_max(input, max) {
    max = parseFloat(max);
    if (typeof input == "bigint" && input >= max) return false;
    if (typeof input == "number" && input >= max) return false;
    if (typeof input == "string" && input.length >= max) return false;
    if (typeof input == "object" && input.length >= max) return false;
    return true;
}

/**
 * Validates email with regex
 *
 * @param {string} email
 *
 * @return {boolean} true/false
 */
function validate_email(email) {
    if (!email) return false;
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(email).toLowerCase());
}

/**
 * Validates password by checking minimum length
 *
 * @param {string} password
 *
 * @return {boolean} true/false
 */
function validate_password(password) {
    if (!password) return false;
    return password.length >= 6;
}

/**
 * Validates password with regex
 *
 * @param {string} phone
 *
 * @return {boolean} true/false
 */
function validate_phone(phone) {
    if (!phone) return false;
    var reg = /^[\+]?\d+$/;
    return reg.test(String(phone).toLowerCase());
}

/**
 * Validates digits with regex
 *
 * @param {string | number} digits
 *
 * @return {boolean} true/false
 */
function validate_digit(digits) {
    if (!digits) return false;
    var reg = /^\d+$/;
    return reg.test(String(digits).toLowerCase());
}

function button_animation(item, action, key) {
    if (item.classList.contains('loading') || item.classList.contains('done')) {
        return false;
    }
    if (action) action.is_loading = true;
    item.classList.add('loading');
    setTimeout(() => {
        item.classList.add('loader');
    }, 125);
    setTimeout(() => {
        button_animation_end(item, action, key);
    }, 750);
}

function button_animation_end(item, action, key) {
    setTimeout(() => {
        if (scope[key].is_loading) {
            button_animation_end(item, action, key);
            return;
        }
        setTimeout(() => {
            item.classList.remove('loader');
            item.classList.remove('loading');
            item.classList.add('done');
            if (scope[key].is_loading_fail == true) {
                item.classList.add('fail');
            }
            item.classList.add('animated');
            item.classList.add('pulse');
        }, 1);
        setTimeout(() => {
            item.classList.remove('animated');
            item.classList.remove('pulse');
        }, 100);
        setTimeout(() => {
            item.classList.remove('done');
            item.classList.remove('fail');
            if (action) action.is_loading = false;
        }, 900);
    }, 150);
}

/**
 * Copies value to clipboard
 * 
 * @param {string} text text to copy to clipboard
 * 
 * @return {boolean} whether copy was successfull or not
 */
function copy_to_clipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;

    // Avoid scrolling to bottom
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.position = "fixed";
    // textarea.style.display = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        var res = document.execCommand('copy');
        document.body.removeChild(textarea);
        return res;
    } catch (err) {
        console.error('Oops, unable to copy', err);
        document.body.removeChild(textarea);
        return false;
    }
}

/**
 * Copies value to clipboard
 * 
 * @param {string} text text to copy to clipboard
 * 
 * @return {boolean} whether copy was successfull or not
 */
function location_get() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(ev.location_get_response);
    } else {
        ev.location_get_response({});
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
//#endregion

//#region handlers
/**
 * Clears local storage and redirect.
 *
 * @return {void} redirects to login page
 */
function logout(delay = 100) {
    console.log("in logout");
    // return;
    setTimeout(function () {
        cookie_delete("token");
        cookie_delete("user_id");
        window.location.href = "login";
    }, delay)
}

/**
 * Sends login form on pressing enter
 *
 * @param {object} obj xhr parameters as an object.
 *
 * @return {string} stringified parameters.
 */
function keyup_handle(e) {
    e.preventDefault();
    if (e.keyCode == 13) { //enter
        var is_login = window.location.href.indexOf('login') != -1;
        if (!is_login) return;
        if (scope.login_section == 1) { //login form
            ev.login();
            return;
        }
        if (scope.login_section == 2) { //register form
            if (document.activeElement.classList.contains("keyup_ignore")) {
                return;
            }
            if (ev["register_" + scope.register.step])
                ev["register_" + scope.register.step]();
            return;
        }
    }
}

/**
 * Hides all autocomplete elements on clicking anywhere except autocomplete elements.
 *
 * Autocomplete element should contains these dataset:
 *
 * @param {string} key section key from dataset
 * @param {string} prop section property name from dataset
 * @param {string} prop2 autocomplete property name from dataset
 * @param {string} prop_i autocomplete property index from dataset
 *
 *
 * @return {void}
 */
function autocomplete_hide() {
    window.addEventListener("click", function (e) {
        if (e.target.dataset.hasOwnProperty("auto_key")) return;
        if (e.target.classList.contains("autoc")) return;
        $$(".autocomplete").forEach(ac => {
            if (scope[ac.dataset.key] && scope[ac.dataset.key][ac.dataset.prop] &&
                ac.dataset.prop2 && ac.dataset.prop_i &&
                scope[ac.dataset.key][ac.dataset.prop][ac.dataset.prop_i] &&
                scope[ac.dataset.key][ac.dataset.prop][ac.dataset.prop_i][ac.dataset.prop2] &&
                scope[ac.dataset.key][ac.dataset.prop][ac.dataset.prop_i][ac.dataset.prop2].length > 0) {
                ac.parentElement.querySelector("input").classList.remove("autoc_active");
                scope[ac.dataset.key][ac.dataset.prop][ac.dataset.prop_i][ac.dataset.prop2] = [];
            }
        });
    });
}

/**
 * Hides error messages on input changes.
 *
 * @return {void}
 */
function error_hide() {
    // $$(".autocomplete")
}


/**
 * Listens for Iframe messages, e.g payment result iframe
 *
 *
 * @return {void}
 */
function listen_iframe_messages() {
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, function (e) {
        // if (e.origin !== 'http://the-trusted-iframe-origin.com') return;
        if (!e || !e.data || !e.data.search)
            return;
        console.log(e);
        if (e.data.search("event=payment_done") > -1 || e.message.search("event=payment_done") > -1) {
            let d;
            if (e.message) d = e.message.split("&");
            if (e.data) d = e.data.split("&");
            let success = d[1].split("=")[1];
            let msg = d[2].split("=")[1];
            $("#modal_iframe .iframe").classList.add("none");
            $("#modal_iframe .response").classList.remove("none");
            $("#modal_iframe .response .msg").innerText = utf8_decode(msg);
            if (success == "True" || success == "true") {
                $("#modal_iframe .response .successful").classList.remove("none");
                $("#modal_iframe .response .failed").classList.add("none");
                ev.get_do("company_payment_infos");
            } else {
                $("#modal_iframe .response .successful").classList.add("none");
                $("#modal_iframe .response .failed").classList.remove("none");
            }
        }
    });
}

/**
 * Sends a ping to the server to confirm current credential.
 *
 * On failure, logout.
 *
 * Else updates self object, sets theme and direction.
 *
 * @return {Promise<void>}
 */
async function ping(i = 0) {
    // pre
    var d = {
        token: scope.self.token,
        action: "self",
        section: "dashboard",
    };
    d = params_to(d);

    // do
    try {
        d = await fetch_(scope.url.server + "xhr", fetchd(d));
    } catch (ex) {
        if (i >= 3) {
            console.log("ping failed: " + x.message);
            toast("ping failed: " + x.message, -1);
            toast("Server ping failed, logging out", 0);
            logout(3000);
        }
        setTimeout(function () {
            ping(i + 1);
        }, (i + 1) * 1000);
    }

    // post
    if (!d || d == "") {
        console.log("In ping, fail to connect!");
        toast("In ping, fail to connect!", -1);
        toast("Server ping failed, logging out", 0);
        logout(3000);
    }
    if (typeof d == "object") {
        toast(d.str);
        console.log("In ping, bad data!", -1);
        toast("Server ping, bad data, logging out", 0);
        logout(3000);
        return;
    }
    d = params_from(d);
    if (d.success == true) {
        if (typeof d.data == "string") d.data = JSON.parse(d.data);
        var k = scope.self.key;
        var t = scope.self.token;
        scope.self = d.data;
        scope.self.key = k;
        scope.self.token = t;
        localStorage.setItem("user", crypt(JSON.stringify(scope.self)));
        //
        document.body.classList.remove('dark');
        document.body.classList.remove('light');
        document.body.classList.add(scope.self.theme);
        document.body.classList.add(scope.self.language_.direction);
        window.setTimeout(function () {
            $(".body_inner").classList.add('true');
        }, 500);
        //
    } else {
        toast(d.str, -1);
        console.log("In ping, success is not true:");
        console.log(d.str);
        toast("Server ping, success is not true, logging out", 0);
        logout(3000);
    }
}

/**
 * Setups login page
 *
 * @return {void}
 */
function init_login() {
    var url = new URL(window.location);
    // await ev.get_language();
    // ev.get_packages();
    location_get();
    scope.forgot.secret = url.searchParams.get("secret");
    if (scope.forgot.secret && scope.forgot.secret != "") {
        scope.forgot.name = url.searchParams.get("n");
        ev.set_value_do("login_section", 4);
    }
    let section = url.searchParams.get("s");
    if (section && section == "r") {
        scope.login_section = 2;
    }
    setTimeout(function(){
        $(".body_inner ").classList.remove("none");
        loading(false);
    }, 500);
}

/**
 * Setups index page
 *
 * @return {Promise<void>}
 */
async function init_index() {
    // await ping();
    // window.onbeforeunload = function () {
    //     // return scope.lang.dictionary["Are you sure?"];
    //     return "Are you sure?";
    // };
    // ev.get("notifications");
    $("#overlay").addEventListener("click", ev.menu_hide);
    $$(".modal").forEach(el => {
        el.addEventListener("click", ev.modal_close_listener);
    })
    $("#main").addEventListener("click", function (e) {
        // ev.filter_hide(e);
        if (e.target.dataset.hasOwnProperty("auto_key")) return;
        $$(".autocomplete").forEach(ac => {
            if (scope[ac.dataset.key] && scope[ac.dataset.key].auto_show) {
                ac.classList.remove("true");
                scope[ac.dataset.key].auto_show = false;
            }
        });
    });
    skeleton_hide();
    return new Promise(resolve => {
        resolve('resolved');
    });
}

/**
 * In index page, gets self from local storage and check is it valid or not.
 *
 * In login page, gets register obj to load last register state.
 *
 * @return {void} in index, if self doesn't exist or be corrupted, then it will logout user
 */
function init_self() {
    var is_login = window.location.href.indexOf('login') != -1;
    let token = cookie_get("token");
    let user_id = cookie_get("user_id");
    scope.self = {};
    scope.self.token = token;
    scope.self.user_id = user_id;
    if (token == null || user_id == null){
        if (!is_login) { //index
            logout();
        }
    } else if(is_login){
        location.href = "/";
    }
}

/**
 * Gets preferences, languages, modules and schema from server
 *
 * @return {Promise<void>}
 */
function consts_init() {
    if (!scope.self || !scope.self.token)
        return;
    let msg = {
        action: "consts_init",
        data: {
            is_login: window.location.href.indexOf('login') != -1,
            url_server: scope.url.server,
            id: scope.self.id,
            user_key: scope.self.key,
            token: scope.self.token,
            sep: scope.sep,
        }
    };
    worker.postMessage([msg]);
}

/**
 * Gets preferences, languages, modules and schema from server
 *
 * @return {Promise<void>}
 */
async function consts_init_sync() {
    if (!scope.self || !scope.self.token)
        return;

    //get preferences
    const res_pref = await fetch(scope.url.server + "pref", fetchd(params_to({
        token: scope.self.token
    })));
    const txt_pref = await res_pref.text();
    scope.pref = JSON.parse(utf8_decode(atob(txt_pref)));
    $('title').innerText = scope.pref.app_name;

    //get language dictionary
    const res_dic = await fetch(scope.url.server + "dic", fetchd(params_to({
        token: scope.self.token
    })));
    const txt_dic = await res_dic.text();
    scope.dic = JSON.parse(utf8_decode(atob(txt_dic)));

    //check logged in or not
    if (window.location.href.indexOf('login') != -1) { //is login
        return new Promise(resolve => {
            resolve('resolved');
        });
    }

    //get modules
    const res_modules = await fetch(scope.url.server + "modules", fetchd(params_to({
        token: scope.self.token
    })));
    const txt_modules = await res_modules.text();
    scope.modules_top = JSON.parse(utf8_decode(atob(txt_modules)));
    if (scope.modules_top.length != 0) {
        scope.url.server = scope.modules_top[0].addr;
        scope.logo = scope.modules_top[0].logo;
        if (scope.url.server[scope.url.server.length - 1] != '/')
            scope.url.server += "/";
    }

    //get schema
    const res_schema = await fetch(scope.url.server + "schema", fetchd(params_to({
        token: scope.self.token
    })));
    const d = await res_schema.text();
    var consts_ = JSON.parse(utf8_decode(atob(d)));
    if (consts_.length == 0) {
        console.log("In consts_init_sync, bad data, schema is empty!");
        toast("In init, not authed! logging out", 0);
        return logout(3000);
    }
    schema_set(consts_);
    return new Promise(resolve => {
        resolve('resolved');
    });
}

/**
 * Handles failed init
 *
 * @return {void}
 */
async function consts_init_from_worker_failed() {
    console.log("In consts_init, bad data, , schema is empty!");
    toast("In consts_init, not authed! logging out", 0);
    // return logout(3000);
}
/**
 * Gets preferences, languages, modules and schema from server
 *
 * @return {void}
 */
async function consts_init_from_worker(preference, chats, contacts, settings) {
    if (!scope.self || !scope.self.token)
        return;

    //preferences
    scope.preference = preference;
    $('title').innerText = scope.preference.app_name;

    scope.chats = chats.data;
    scope.contacts = contacts.data;
    scope.settings = settings.data;

    await init_index();
}

/**
 * Check is vendor offer page or not
 *
 * @return {boolean}
 */
async function is_vendor_offer() {
    if (location.href.indexOf('offer') != -1) { //login page
        // loading(true);
        await ev.get_language();
        await ev.vendor_offer_get_url();
        await ev.vendor_offer_get();
        loading(false);
        $(".body_inner").classList.add('true');
        return true;
    }
    return false;
}


/**
 * Initialize the app for all pages
 *
 * @return {boolean} page is index or not
 */
function init_basic() {
    let is_index = true;
    rvbind();
    if (window.Worker) {
        worker = new Worker('/js/worker.js?v=0.0.4');
        worker.onmessage = ev.worker_handle;
    }
    try {
        init_self();
    } catch (ex) {
        // console.log("in init, logout");
        console.log(ex);
    }
    if (location.href.indexOf('login') != -1)
        is_index = false;
    return is_index;
}
/**
 * Initialize the app
 *
 * Calls proper functions according to user state(logged in or not)
 *
 * @return {void}
 */
async function init() {
    let is_index = init_basic();
    // 
    if (!is_index) { //login page
        init_login();
        return;
    }
    
    await init_index();
    try {
        if (window.Worker) {
            consts_init(); //calls worker, worker_handler get the response
        } else {
            await consts_init_sync();
            await init_index();
        }
    } catch (ex) {
        console.log("in init, logout");
        console.log(ex);
        toast("in init, logging out", 0);
        logout(3000);
    }
    loading(false);
}

function get_server_addr()
{
    fetch(window.location.origin + path_base(window.location.pathname) + "/srv.json").then(function (res) {
        return res.json();
    }).then(function (resp) {
        scope.url.server = resp.root;
        init();
    }).catch(err => {
        toast("Fail to get server address, please contact support.", -1);
        console.log(err);
    });
}

function get_language()
{
    fetch(window.location.origin + path_base(window.location.pathname) + "/lang.json").then(function (res) {
        return res.json();
    }).then(function (resp) {
        if(!scope.lang)
            scope.lang = {};
        scope.lang.dictionary = resp;
    }).catch(err => {
        toast("Fail to get language, please contact support.", -1);
        console.log(err);
    });
}

async function main() {
    //
    var hash = window.location.hash.substr(3);
    if (hash) {
        var d = JSON.parse(utf8_decode(atob(hash)));
        localStorage.setItem("user", d.user);
        localStorage.setItem("do", d.do);
        window.location.href = window.location.href.split('#')[0]; // later change with history state
    }
    //
    get_server_addr();
    get_language();
    $$(".input").forEach(el => {
        el.addEventListener("click", function(e){
            if(el.querySelector("input")) el.querySelector("input").focus();
            if(el.querySelector("textarea")) el.querySelector("textarea").focus();
        });
    })
    document.addEventListener("keyup", keyup_handle);
    listen_iframe_messages();
    autocomplete_hide();
    error_hide();
    img_def = $("#img_def") ? $("#img_def").src : "";
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function (event) {
        history.pushState(null, document.title, location.href);
    });
}

//#endregion

//this is where everything start
document.addEventListener("DOMContentLoaded", main);