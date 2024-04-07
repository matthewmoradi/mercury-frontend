function objectToQuerystring(obj) {
    if (typeof obj == "string") return obj;
    // if (Object.keys(obj).length <= 1) return obj;
    return Object.keys(obj).reduce(function (str, key, i) {
        var delimiter, val;
        delimiter = (i === 0) ? '' : ';';
        key = (key);
        if (obj[key] == undefined || obj[key] == null) {
            val = 0;
        } else if (typeof obj[key] == "object") {
            val = (JSON.stringify(obj[key]));
        } else {
            val = (obj[key]);
        }
        return [str, delimiter, key, ':', val].join('');
    }, '');
}

function utf8_encode(s) {
    return unescape(encodeURIComponent(s));
}

function utf8_decode(s) {
    return decodeURIComponent(escape(s));
}

function loading(show, key) {
    if(key != undefined && document.querySelector("#loading_" + key)){
        if (show == false) {
            document.querySelector("#loading_" + key).classList.remove("true");
            return;
        }
        document.querySelector("#loading_" + key).classList.add("true");
        return;
    }
    if (show == false) {
        document.querySelector("#loading").classList.add("none");
        document.querySelector("#loading").classList.remove("trans");
        return;
    }
    document.querySelector("#loading").classList.add("trans");
    document.querySelector("#loading").classList.remove("none");
}

function toast(msg = "toast msg", type = 0) {
    class_to_add = "warning";
    if (type == -1) {
        class_to_add = "error";
    } else if (type == 1) {
        class_to_add = "success";
    }
    var toast = document.querySelector(".toast");
    toast.classList.remove("warning");
    toast.classList.remove("error");
    toast.classList.remove("success");

    toast.classList.add(class_to_add);
    toast.querySelector(".toast_msg").innerText = msg;

    var _toast = toast.cloneNode(true);
    document.body.appendChild(_toast);
    setTimeout(function () {
        _toast.classList.add("true");
    }, 100);

    setTimeout(function () {
        _toast.classList.remove("true");
    }, 3000);

    setTimeout(function () {
        document.body.removeChild(_toast);
    }, 4000);
}

function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return null;
}

function trace(text) {
    // return;
    if (text[text.length - 1] === '\n') {
        text = text.substring(0, text.length - 1);
    }
    if (window.performance) {
        var now = (window.performance.now() / 1000).toFixed(3);
        console.log(now + ': ' + text);
    } else {
        console.log(text);
    }
}

ev.long_to_jdate = function (long) {
    if (long == undefined || long == 0) return "";
    long += "000";
    var date = new Date(parseInt(long));
    if (date == "Invalid Date") return "";
    var _date = toJalaali(date);
    return _date;
}

ev.jdate_to_long = function (y, m, d, h = 0, min = 0) {
    if (y == undefined || m == undefined || d == undefined) return 0;
    let g;
    try {
        g = toGregorian(parseInt(y), parseInt(m), parseInt(d));
    } catch (x) {
        trace("in jdate to long: " + x);
        return 0;
    }
    date = new Date(g.gy, g.gm - 1, g.gd, h, min);
    date = date.getTime().toString();
    // date = date.slice(0, date.length - 3);
    return parseInt(date) + scope.timediff; //+3:30 timezone
}

ev.date_to_long = function (y, m, d, h = 0, min = 0) {
    date = new Date(y, m - 1, d, h, min);
    date = date.getTime().toString();
    // date = date.slice(0, date.length - 3);
    return date;
}

ev.long_to_date = function (long) {
    if (long == undefined || long == 0) return "";
    long = parseInt(long) - scope.timediff; //+3:30 timezone
    return new Date(long);
}

//d: {suc, msg, data}
function fetchd(data) {
    let f = {
        method: "POST",
    };
    if (data && data != "") f.body = objectToQuerystring(data);
    return f;
}

function main() {
    rvbind();
    if (document.querySelector("#index"))
        ev.dashboard.init();
    document.addEventListener("keyup", keyboard);
}

function rvbind() {
    rivets.bind(document, {
        scope: scope,
        ev: ev
    });
}

function genKey() {
    var key = "";
    for (var i = 0; i < 8; i++) {
        key += String.fromCharCode(parseInt((Math.random() * 26) + 65));
    }
    trace("generate key: " + key);
    return key;
}

function splice(str, start, newSubStr) {
    return str.slice(0, start) + newSubStr + str.slice(start);
};

function embedKey(str) {
    if (str == undefined || typeof str != "string" || str == "" || str.length < 25) {
        trace("invalid data in embed key");
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

function encrypt(data) {
    if (data == null) {
        console.log("data == null");
        return null;
    }
    if (scope.self.key == undefined) {
        console.log("player hasn't key...");
        // logout();
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

function keyboard(e) {
    if (e.keyCode == 27) { //escape

    }
    if (e.keyCode == 13) { //enter
        if (document.querySelector("#login_form")) {
            ev.login();
            return;
        }
    }
    if (e.keyCode == 8) { //backspace

    }
}

//////////login
ev.login = function () {
    if (!scope.login.ln || scope.login.ln == "") {
        trace("form error");
        return false;
    }
    if (!scope.login.pwd || scope.login.pwd == "") {
        trace("form error");
        return false;
    }
    scope.self.key = genKey();
    var _ = "loginname:" + scope.login.ln + scope.sep + "password:" + scope.login.pwd;
    // ln: scope.login.ln,
    // pwd: scope.login.pwd
    _ = (btoa(encrypt(_)));
    trace("login _: " + _);
    _ = embedKey(_);
    fetch(scope.url.server + "E0gIBQwLSFZJCQkHDjUcGxgCNBoBBw4OBxseTkdMGx4ZSFJMPhkZAEgAgcNCkojHhpKRkkOCRoLTlFMWUgW", fetchd(_))
        .then(r => r.text())
        .then(d => {
            if (!d || d == "") {
                toast("Fail to connect!");
            }
            d = encrypt(atob(d));
            d = JSON.parse(d);
            if (d.code == "200") {
                if (d.success) {
                    if (typeof d.data == "string" && d.data != "") d.data = JSON.parse(d.data);
                    if (d.data.key == null) {
                        toast("fail: server error", -1);
                        return;
                    }
                    scope.self = d.data.self;
                    scope.self.key = d.data.key;
                    scope.self.token = d.data.token;
                    localStorage.setItem("user", encrypt(JSON.stringify(scope.self)));
                    localStorage.setItem("do", btoa(scope.self.key));
                    if(location.href.search(".html") > -1)
                        location.href = "index.html";
                    else
                        location.href = "/cms/";
                } else {
                    toast("fail: " + d.str, -1);
                }
            } else {
                toast("fail: " + d.str, -1);
            }
        })
        .catch(x => {
            toast("Fail to login: " + x.message);
            trace("Fail to login: " + x.message);
        });
}

ev.logout = function () {
    // localStorage.clear();
    delete_cookie("token");
    delete_cookie("user_id");
    window.location.href = "login.html";
    if(location.href.search(".html") > -1)
        location.href = "login.html";
    else
        location.href = "/cms/login";
}

document.addEventListener("DOMContentLoaded", main);

// (function () {
//     main();
// })();

//////////////////////formatters
rivets.formatters.eq = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x == y;
}
rivets.formatters.neq = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x != y;
}
rivets.formatters.len = function (arr) {
    if (!arr) return 0;
    return arr.length;
}
rivets.formatters.not = function (x) {
    if (x == undefined) return x;
    return !x;
}
rivets.formatters.jdate = function (long) {
    if (long == undefined || long == 0) return "---";
    long += "000";
    var date = new Date(parseInt(long));
    if (date == "Invalid Date") return "---";
    var _date = toJalaali(date);
    return _date.jy + "/" + _date.jm + "/" + _date.jd;
}
rivets.formatters.datetime = function (obj) {
    if (obj == undefined || obj == 0) return "---";
    var date;
    if (!isNaN(Number(obj))) {
        date = new Date(parseInt(obj));
    } else {
        try {
            date = new Date(obj);
        } catch (e) {
            return "---";
        }
    }
    if (date == "Invalid Date") return "---";
    return date.getFullYear() + "/" + (date.getMonth() + 1).toString() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
rivets.formatters.jdatetime = function (obj) {
    if (obj == undefined || obj == 0) return "---";
    var date;
    if (!isNaN(Number(obj))) {
        date = new Date(parseInt(obj) - scope.timediff);
    } else {
        try {
            date = new Date(obj);
        } catch (e) {
            return "---";
        }
    }
    if (date == "Invalid Date") return "---";
    var _date = toJalaali(date);
    return _date.jy + "/" + _date.jm + "/" + _date.jd + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
rivets.formatters.keys = function (obj) {
    if (!obj) return [];
    return Object.keys(obj);
}
rivets.formatters.plus_one = function (i) {
    return i + 1;
}
rivets.formatters.minus_one = function (i) {
    return i - 1;
}
rivets.formatters.nonegative = function (i) {
    if (i < 0) return 0;
    return i;
}
rivets.formatters.empty_string = function (str) {
    if (str == undefined || str == "") return "---"
    return str;
}
rivets.formatters.atob = function (str) {
    if (str == undefined || str == "") return "---";
    try{
        str = utf8_decode(atob(str));
    } catch(e) {
        str = str;
    }
    return str;
}
rivets.formatters.btoa = function (str) {
    if (str == undefined || str == "") return "---";
    try{
        str = btoa(str);
    } catch(e) {
        str = str;
    }
    return str;
}
rivets.formatters.show_date = function (month, year) {
    if (!scope.calender.date_current) return false;
    var res = "";
    switch (month + 1) {
        case 1:
            res = "فروردین";
            break;
        case 2:
            res = "اردیبهشت";
            break;
        case 3:
            res = "خرداد";
            break;
        case 4:
            res = "تیر";
            break;
        case 5:
            res = "مرداد";
            break;
        case 6:
            res = "شهریور";
            break;
        case 7:
            res = "مهر";
            break;
        case 8:
            res = "آبان";
            break;
        case 9:
            res = "آذر";
            break;
        case 10:
            res = "دی";
            break;
        case 11:
            res = "بهمن";
            break;
        case 12:
            res = "اسفند";
            break;
        default:
            break;
    };
    res += " " + year;
    return res;
}
rivets.formatters.day_persian = function (i) {
    if (i == undefined) return '';
    i = parseInt(i);
    if (isNaN(i)) return '';
    var res = "";
    switch (i) {
        case 1:
            res = "شنبه";
            break;
        case 2:
            res = "یکشنبه";
            break;
        case 3:
            res = "دوشنبه";
            break;
        case 4:
            res = "سه‌شنبه";
            break;
        case 5:
            res = "چهارشنبه";
            break;
        case 6:
            res = "پنج‌شنبه";
            break;
        case 7:
            res = "جمعه";
            break;
        case 8:
            res = "آبان";
            break;
        default:
            break;
    };
    return res;
}
rivets.formatters.prefix = function (a, b) {
    if (a == undefined || b == undefined) return "";
    if (a.search(b) > -1) return a;
    if (a.length > 100 && a.search('ase64')) return a;
    return b + a;
}
rivets.formatters.concat_ = function (a, b) {
    if (a == undefined || b == undefined) return "";
    return a.toString() + b.toString();
}
rivets.formatters.nf = function (n, f) {
    if (a == undefined || b == undefined) return "";
    return n.toString() + " " + f.toString();
}
///////////////////////////other functions
function validate_email(email) {
    if (!email) return false;
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(email).toLowerCase());
}

function validate_password(pwd) {
    if (!pwd) return false;
    return pwd.length >= 6;
}

function validate_phone(phone) {
    if (!phone) return false;
    var reg = /^\d+$/;
    return reg.test(String(phone).toLowerCase()) && phone.length == 11;
}