ev.dashboard.init = function () {
    // load header
    // inter val header values
    // check auth
    // set access      
    // welcome
    loading();
    // dashboard
    ev.main();
}

ev.main = function () {
    let date_current = toJalaali(new Date());
    scope.date_from.year = date_current.jy;
    scope.date_from.month = date_current.jm - 1;
    scope.date_from.day = date_current.jd;
    scope.date_to.year = date_current.jy;
    scope.date_to.month = date_current.jm;
    scope.date_to.day = date_current.jd;
    var _do = localStorage.getItem("do");
    if (_do == null || _do == "null" || _do == "") {
        ev.logout();
    }
    var cookie = getCookie("user_id");
    if (cookie == null || cookie == "null" || cookie == "") {
        ev.logout();
    }
    cookie = getCookie("token");
    if (cookie == null || cookie == "null" || cookie == "") {
        ev.logout();
    }
    scope.self.key = atob(_do);
    var self = localStorage.getItem("user");
    if (self == null || self == "null" || self == "") {
        ev.logout();
    }
    scope.self = JSON.parse(encrypt(self));
    if (self == null || self == "null" || self == "") {
        ev.logout();
    }
    ev.ping();
    loading(true);
    // ev.get_preference_client();
    // ev.get("todos");
    // ev.get("notifications");
    // ev.get("dashboard");
    ev.get("attachments");
    ev.get("categories");
    ev.get("locations");
    Chart.defaults.global.defaultFontFamily = 'Arial, cursive';
    ev.sort_set_listioner();
    window.addEventListener("click", function (e) {
        if (e.target.dataset.hasOwnProperty("auto_key")) return;
        document.querySelectorAll(".autocomplete").forEach(ac => {
            if (scope[ac.dataset.key] && scope[ac.dataset.key].auto_show) {
                ac.classList.remove("true");
                scope[ac.dataset.key].auto_show = false;
            }
        });
    });
    // window.setInterval(function () {
    //     ev.get("notifications");
    // }, 20000);
    // window.setInterval(function () {
    //     ev.get("todos");
    // }, 15000);
    loading(false);
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']                                         // remove formatting button
    ];
      
    var options = {
        // debug: 'info',
        modules: {
          toolbar: toolbarOptions
        },
        // placeholder: 'Compose an epic...',
        // readOnly: true,
        theme: 'snow'
      };
      var editor = new Quill('#editor', options);
      var editor_event = new Quill('#editor_event', options);
}

ev.onsection = function (item, name) {
    document.querySelectorAll(".form").forEach(f => {
        f.classList.remove("true");
    });
    scope.pages = [];
    scope.search.s = "";
    scope.search.s_ = "";
    scope.size = 0;
    scope.prop = null;
    scope.val = null;
    if (name == "consts") { } else if (name == "dashboard") {
        loading(false);
    } else {
        scope[name].page = 1;
        scope.skip = 0;
        scope.sort_asc = 0;
        scope.sort_key = "id";
        ev.get(name);
    }
    document.querySelectorAll('.aside .item').forEach(element => {
        element.classList.remove('true');
    });
    if (name == "consts") {
        ev.consts.get_();
        item.classList.add('true');
        return;
    }
    document.querySelectorAll('section.content').forEach(element => {
        element.classList.add('none');
    });
    item.classList.add('true');
    document.querySelector('#' + name).classList.remove('none');
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
/***************************************global */
ev.ping = function () {
    var d = {
        token: scope.self.token,
        action: "self",
        section: "users",
    };
    d = objectToQuerystring(d);
    d = utf8_encode(d);
    d = btoa(d);
    d = btoa(encrypt(d));
    d = scope.self.id + scope.sep + d;
    fetch(scope.url.server + "xhr", fetchd(d))
        .then(r => r.text())
        .then(d => {
            if (!d || d == "") {
                toast("Failed to connect!");
                ev.logout();
            }
            if (typeof d == "object") {
                toast(d.str);
                ev.logout();
                return;
            }
            // d = encrypt(atob(d));
            d = utf8_decode(atob(encrypt(atob(d))));
            d = JSON.parse(d);
            if (d.code == "200") {
                if (typeof d.data == "string") d.data = JSON.parse(d.data);
                var k = scope.self.key;
                var t = scope.self.token;
                scope.self = d.data;
                scope.self.key = k;
                scope.self.token = t;
                localStorage.setItem("user", encrypt(JSON.stringify(scope.self)));
            } else {
                toast(d.str);
                ev.logout();
            }
        })
        .catch(x => {
            console.log("ping failed: " + x.message);
            toast("ping failed: " + x.message);
            ev.logout();
        });
}

ev.get = function (key, prop, val) {
    if (typeof key == "object") {
        key = this.dataset.key;
    }
    if (!key || key == "") return;
    if (ev[key] && ev[key].get_pre)
        if (!ev[key].get_pre(key, prop, val)) {
            loading(false);
            return;
        }
    loading(true, key);
    var d = {
        skip: scope.skip,
        take: scope.preference_clients.take,
        sort_asc: scope.sort_asc,
        sort: scope.sort_key,
        token: scope.self.token,
        action: "g"
    };
    if (key == "comments_") {
        d.section = "comments";
    } else {
        d.section = key;
    }
    if (prop && typeof prop != "object") d[prop] = val;
    else if (scope.prop != null) d[scope.prop] = scope.val;
    if (prop != "d_p" && scope.prop != "d_p") ev.cancel(key);
    d.token = scope.self.token;
    d.date_from = ev.jdate_to_long(scope.date_from.year, scope.date_from.month, scope.date_from.day);
    d.date_to = ev.jdate_to_long(scope.date_to.year, scope.date_to.month, scope.date_to.day);
    d = objectToQuerystring(d);
    d = utf8_encode(d);
    console.log("get." + key + ": " + d);
    d = btoa(d);
    d = btoa(encrypt(d));
    d = scope.self.id + scope.sep + d;
    fetch(scope.url.server + "xhr", fetchd(d))
        .then(r => r.text())
        .then(d => {
            try {
                d = JSON.parse(d);
                toast(d.str);
                return;
            } catch (ex) { }
            // d = encrypt(atob(d));
            d = utf8_decode(atob(encrypt(atob(d))));
            d = JSON.parse(d);
            loading(false, key);
            if (d.code == "200") {
                // console.log("get." + key + ": " + d.data);
                if (typeof d.data == "string") d.data = JSON.parse(d.data);
                scope[key].data = d.data;
                scope[key].size = d.size;
                paginiation(key);
                if (ev[key].get_post) ev[key].get_post();
            } else {
                if (d.str && d.str != ""){
                    console.log("ev." + key + ".get failed: " + d.str);
                    toast("ev." + key + ".get failed: " + d.str);
                }
            }
        })
        .catch(x => {
            loading(false, key);
            console.log("ev." + key + ".get failed: " + x.message);
            toast("ev." + key + ".get failed: " + x.message);
        });
}

ev.get_ = function (key, _d, is_auto_select = false) {
    if (typeof key == "object") {
        key = this.dataset.key;
    }
    if (!key || key == "") return;
    if (key == "players_") key = "players";
    if (ev[key].get__pre) ev[key].get__pre(key);
    let d = {};
    if (_d == undefined || typeof _d == "object")
        d.id = this.dataset.d;
    else
        d.id = _d;
    if(d.id == "") return;
    d.section = key;
    d.action = "g_";
    d.token = scope.self.token;
    d = objectToQuerystring(d);
    d = utf8_encode(d);
    console.log("get_." + key + ": " + d);
    d = btoa(d);
    d = btoa(encrypt(d));
    d = scope.self.id + scope.sep + d;
    fetch(scope.url.server + "xhr", fetchd(d))
        .then(r => r.text())
        .then(d => {
            try {
                d = JSON.parse(d);
                toast(d.str);
                return;
            } catch (ex) { }
            d = utf8_decode(atob(encrypt(atob(d))));
            // d = encrypt(atob(d));
            // d = utf8_decode(d);
            d = JSON.parse(d);
            if (d.code == "200") {
                // console.log("get_." + key + ": " + d.data);
                if (typeof d.data == "string") d.data = JSON.parse(d.data);
                scope[key].data_ = d.data;
                if (ev[key].get__post) ev[key].get__post(d);
                if (!is_auto_select && document.querySelector(scope[key].form_id)) {
                    scope[key].form_header = scope[key].form_header_edit;
                    document.querySelector(scope[key].form_id).classList.add("true");
                }
            } else {
                toast("Error" + d.str, -1);
            }
        })
        .catch(x => {
            console.log("ev." + key + ".get_ failed: " + x.message);
            toast("ev." + key + ".get_ failed: " + x.message);
        });
}

ev.cancel = function (key) {
    scope.prop = null;
    scope.val = null;
    if (typeof key == "object") {
        key = this.dataset.key;
    }
    if (!key || key == "") return;
    if (document.querySelector(scope[key].form_id)) {
        document.querySelector(scope[key].form_id).classList.remove("true");
    }
}

ev.set_ = function (key) {
    if (typeof key == "object") {
        if (key.keyCode == 13) {
            if (this.dataset.key)
                ev.set(this.dataset.key);
        } else return;
    }
    if (!key || key == "") return;
    ev.set(key);
}

ev.set = function (key) {
    if (typeof key == "object") {
        if (this.dataset == undefined) return;
        key = this.dataset.key;
    }
    if (!key || key == "") return;
    var i;
    if (this.dataset) i = this.dataset.i;
    if (ev[key].set_pre) ev[key].set_pre(key, i);
    if (ev[key].is_vaild && !ev[key].is_vaild(key)) return;
    loading(true);
    var d = scope[key].data_;
    d.section = key;
    d.action = "_";
    d.token = scope.self.token;
    d = objectToQuerystring(d);
    d = utf8_encode(d);
    console.log("set." + key + ": " + d);
    d = btoa(d);
    d = btoa(encrypt(d));
    d = scope.self.id + scope.sep + d;
    fetch(scope.url.server + "xhr", fetchd(d))
        .then(r => r.text())
        .then(d => {
            loading(false);
            try {
                d = JSON.parse(d);
                toast(d.str);
                return;
            } catch (ex) { }
            // d = encrypt(atob(d));
            d = utf8_decode(atob(encrypt(atob(d))));
            d = JSON.parse(d);
            if (d.code == "200" && d.success) {
                d.data = d.data.split('"').join('');
                setTimeout(function () {
                    if(scope[key].data_.id)
                        toast(key.slice(0, key.length - 1) + " " + scope[key].data_.id + " Submitted Successfully!", 1);
                    else
                        toast("New " + key.slice(0, key.length - 1) + " Submitted Successfully!", 1);
                    ev.get(key);
                }, 100);
                if (ev[key].set_post) ev[key].set_post(d.data);
            } else {
                toast("Error: " + d.str, -1);
            }
        })
        .catch(x => {
            loading(false);
            console.log("ev." + key + ".set: " + x.message);
            toast("ev." + key + ".set: " + x.message);
            console.log("ev.events.set_post: " + x.stack);
        });
}

ev.add = function (key) {
    if (typeof key == "object") {
        key = this.dataset.key;
    }
    if (!key || key == "") return;
    if (ev[key].add_pre)
        ev[key].add_pre(key);
    scope[key].data_ = {};
    if (document.querySelector(scope[key].form_id)) {
        scope[key].form_header = scope[key].form_header_add;
        document.querySelector(scope[key].form_id).classList.add("true");
    }
    if (ev[key].add_post)
        ev[key].add_post(key);
}

ev.delete_check = function(key) {
    var md = document.querySelector("#modal_delete");
    md.querySelector("#yes").dataset.key = key;
    md.classList.add("true");
}

ev.delete_yes = function() {
    var key;
    var md = document.querySelector("#modal_delete");
    key = this.dataset.key;
    if (!key || key == "") return;
    this.dataset.key = "";
    ev.delete_do(key);
    md.classList.remove("true");
}

ev.delete_no = function() {
    var md = document.querySelector("#modal_delete");
    md.classList.remove("true");
}

ev.delete = function (key) {
    if (typeof key == "object") {
        key = this.dataset.key;
    }
    if (!key || key == "") return;
    ev.delete_check(key);
}

ev.delete_do = function (key) {
    let d = {};
    d.id = scope[key].data_.id;
    d.section = key;
    d.action = "_0";
    d.token = scope.self.token;
    d = objectToQuerystring(d);
    d = utf8_encode(d);
    console.log("delete." + key + ": " + d);
    d = btoa(d);
    d = btoa(encrypt(d));
    d = scope.self.id + scope.sep + d;
    fetch(scope.url.server + "xhr", fetchd(d))
        .then(r => r.text())
        .then(d => {
            try {
                d = JSON.parse(d);
                toast(d.str);
                return;
            } catch (ex) { }
            d = utf8_decode(atob(encrypt(atob(d))));
            // d = encrypt(atob(d));
            d = JSON.parse(d);
            if (d.code == "200") {
                toast("Deleted Successfully", 1);
                ev.cancel(key);
                ev.get(key);
            } else {
                toast("Error: " + d.str, -1);
            }
        })
        .catch(x => {
            console.log("ev." + key + ".set: " + x.message);
            toast("ev." + key + ".set: " + x.message);
        });
}

ev.search = function (key, auto_key = undefined, is_timeout = false) {
    let is_obj = false;
    if (typeof key == "object") {
        is_obj = true;
        key = this.dataset.key;
        auto_key = this.dataset.auto_key;
    }
    if (!key || key == "") return;
    if (is_obj || !is_timeout) {
        clearTimeout(scope.search_timeout);
        scope.search_ready = false;
        scope.search_timeout = setTimeout(function () {
            scope.search_ready = true;
            ev.search(key, auto_key, true);
        }, 400);
    }
    if (scope.search_ready == false) return;
    let d = {};
    if (scope.search.s != "") d.s = scope.search.s;
    else d.s = scope.search.s_;
    d.skip = scope.skip;
    d.take = scope.preference_clients.take;
    d.sort_asc = scope.sort_asc;
    d.sort = scope.sort_key;
    d.section = key;
    d.action = "g";
    d.token = scope.self.token;
    d = objectToQuerystring(d);
    d = utf8_encode(d);
    console.log("search." + key + ": " + d);
    d = btoa(d);
    d = btoa(encrypt(d));
    d = scope.self.id + scope.sep + d;
    fetch(scope.url.server + "xhr", fetchd(d))
        .then(r => r.text())
        .then(d => {
            try {
                d = JSON.parse(d);
                toast(d.str);
                return;
            } catch (ex) { }
            // d = encrypt(atob(d));
            d = utf8_decode(atob(encrypt(atob(d))));
            d = JSON.parse(d);
            if (d.code == "200") {
                if (typeof d.data == "string") d.data = JSON.parse(d.data);
                scope[key].data = d.data;
                scope[key].size = d.size;
                if (auto_key) ev.autocomplete(auto_key);
            } else {
                toast("Error: " + d.str, -1);
            }
        })
        .catch(x => {
            console.log("ev." + key + ".search: " + x.message);
            toast("ev." + key + ".search: " + x.message);
        });
}

ev.auto_select = function () {
    if (this.dataset.key == "accounts") {
        scope.accounts.data_.player_id = this.dataset.id;
        scope.accounts.data_.player_name = this.dataset.n;
    }
    scope.search.s_ = "";
}

ev.autocomplete = function (key) {
    scope[key].auto_show = true;
}
/////////////////////////////optional funcs

//////////////dashboard
ev.dashboard.get_post = function (key) {
    var i = 0;
    scope.dashboard.data.charts.forEach(item => {
        if (item.type == "charts") {
            item.keyvalues.forEach(chart => {
                var elem = document.querySelector("#chart_" + i);
                if (typeof chart.value == "string")
                    chart.value = JSON.parse(chart.value);
                if (chart.value.x == undefined) {
                    elem.classList.remove("none");
                    var selector = "#" + elem.id + " canvas";
                    // console.log(selector);
                    ev.set_chart_pie(selector, chart.key, chart.value);
                } else {
                    elem.classList.remove("none");
                    var selector = "#" + elem.id + " canvas";
                    // console.log(selector);
                    ev.set_chart_line(selector, chart.key, chart.value);
                }
                i++;
            });
        }
    });
    if (scope.charts.is_set == false) {
        scope.charts.is_set = true;
    }
}

//////////////attachments
ev.attachments.set_pre = function (key) {
    scope.attachments.data_.data = btoa(scope.attachments.data_.data);
    return true;
}
ev.attachments.set_post = function (key) {
    scope.attachments.data_.data = atob(scope.attachments.data_.data);
    return true;
}
ev.attachments.view_change = function(){
    scope.preferences.att_view = this.dataset.d;
}
ev.attachments.modal_show = function(){
    scope.preferences.att_modal = true;
}
ev.attachments.modal_close = function(){
    scope.preferences.att_modal = false;
    scope.attachments.loc_last = "";
    scope.attachments.key_last = "";
}
ev.attachments.select = function(){
    // this.classList.add("selected");
    if(scope.attachments.loc_last == "" || scope.attachments.key_last == "") return;
    if(!scope.attachments.select_multiple) scope.attachments.selected = [];
    scope.attachments.selected.push(scope.attachments.data[this.dataset.i]);
    if(scope.attachments.loc_last == "editor"){
        scope.attachments.selected.forEach(att => {
            var p = document.createElement("p");
            var img = document.createElement("img");
            img.src = scope.url.server + att.data_300;
            img.alt = att.alt;
            img.title = att.title;
            p.appendChild(img);
            document.querySelector("#editor .ql-editor").appendChild(p);
        });
    } else {
        scope[scope.attachments.key_last].data_[scope.attachments.loc_last] = scope.url.server + scope.attachments.selected[0].data_300;
        scope[scope.attachments.key_last].data_[scope.attachments.loc_last + "id"] = scope.attachments.selected[0].id;
        ev.attachments.modal_close();
    }
    scope.attachments.selected = [];
}
ev.attachments.set = function(){
    scope.attachments.loc_last = this.dataset.d;
    scope.attachments.key_last = this.dataset.key;
    if(scope.attachments.loc_last == "editor"){
        scope.attachments.select_multiple = true;
        return;
    }
    ev.attachments.modal_show();
}
//////////////contents
ev.contents.add_post = function(key){
    var date = new Date();
    var date_j = toJalaali(new Date());
    scope.contents.data_.dt_pub = date.getTime();
    scope.contents.data_.dt_pub_year = date_j.jy;
    scope.contents.data_.dt_pub_month = date_j.jm;
    scope.contents.data_.dt_pub_day = date_j.jd;
    scope.contents.data_.dt_pub_hour = date.getHours();
    scope.contents.data_.dt_pub_min = date.getMinutes();
    document.querySelector("#editor .ql-editor").innerHTML = "";
}

ev.contents.get__pre = function(key){
    ev.get("categories");
    return true;
}

ev.contents.set_pre = function(key){
    scope.contents.data_.body = document.querySelector("#editor .ql-editor").innerHTML;
    scope.contents.data_.body = btoa(utf8_encode(scope.contents.data_.body));
    try {
        scope.contents.data_.dt_pub = ev.jdate_to_long(scope.contents.data_.dt_pub_year,
            scope.contents.data_.dt_pub_month,
            scope.contents.data_.dt_pub_day,
            scope.contents.data_.dt_pub_hour,
            scope.contents.data_.dt_pub_min);
    } catch (x) {
        return false;
    }
    return true;
}

ev.contents.get__post = function(key){
    var date = ev.long_to_date(Number(scope.contents.data_.dt_pub));
    var date_j = toJalaali(date);
    if(date != "Invalid Date" && date != ""){
        scope.contents.data_.dt_pub_year = date_j.jy;
        scope.contents.data_.dt_pub_month = date_j.jm;
        scope.contents.data_.dt_pub_day = date_j.jd;
        scope.contents.data_.dt_pub_hour = date.getHours();
        scope.contents.data_.dt_pub_min = date.getMinutes();
    }
    try{
        scope.contents.data_.body = utf8_decode(atob(scope.contents.data_.body));
    } catch(e){
        scope.contents.data_.body = (scope.contents.data_.body);
    }
    document.querySelector("#editor .ql-editor").innerHTML = scope.contents.data_.body;
}
//////////////events
ev._events.add_post = function(key){
    date = new Date();
    var date_j = toJalaali(date);
    scope._events.data_.dt_pub = date.getTime();
    scope._events.data_.dt_pub_year = date_j.jy;
    scope._events.data_.dt_pub_month = date_j.jm;
    scope._events.data_.dt_pub_day = date_j.jd;
    scope._events.data_.dt_pub_hour = date.getHours();
    scope._events.data_.dt_pub_min = date.getMinutes();
    document.querySelector("#editor_event .ql-editor").innerHTML = "";
}

ev._events.get__pre = function(key){
    ev.get("categories");
    return true;
}

ev._events.set_pre = function(key){
    scope._events.data_.body = document.querySelector("#editor_event .ql-editor").innerHTML;
    scope._events.data_.body = btoa(utf8_encode(scope._events.data_.body));
    try {
        scope._events.data_.dt_pub = ev.jdate_to_long(scope._events.data_.dt_pub_year,
            scope._events.data_.dt_pub_month,
            scope._events.data_.dt_pub_day,
            scope._events.data_.dt_pub_hour,
            scope._events.data_.dt_pub_min);
        scope._events.data_.dt_start = ev.jdate_to_long(scope._events.data_.dt_start_year,
            scope._events.data_.dt_start_month,
            scope._events.data_.dt_start_day,
            scope._events.data_.dt_start_hour,
            scope._events.data_.dt_start_min);
        scope._events.data_.dt_end = ev.jdate_to_long(scope._events.data_.dt_end_year,
            scope._events.data_.dt_end_month,
            scope._events.data_.dt_end_day,
            scope._events.data_.dt_end_hour,
            scope._events.data_.dt_end_min);
        scope._events.data_.dt_reserve = ev.jdate_to_long(scope._events.data_.dt_reserve_year,
            scope._events.data_.dt_reserve_month,
            scope._events.data_.dt_reserve_day,
            scope._events.data_.dt_reserve_hour,
            scope._events.data_.dt_reserve_min);
    } catch (x) {
        return false;
    }
    return true;
}

ev._events.get__post = function(key){
        try{
        var dt_pub = ev.long_to_date(Number(scope._events.data_.dt_pub));
        var dt_pub_j = toJalaali(dt_pub);
        if(dt_pub != "Invalid Date" && dt_pub != ""){
            scope._events.data_.dt_pub_year = dt_pub_j.jy;
            scope._events.data_.dt_pub_month = dt_pub_j.jm;
            scope._events.data_.dt_pub_day = dt_pub_j.jd;
            scope._events.data_.dt_pub_hour = dt_pub.getHours();
            scope._events.data_.dt_pub_min = dt_pub.getMinutes();
        }
        var dt_start = ev.long_to_date(Number(scope._events.data_.dt_start));
        var dt_start_j = toJalaali(dt_start);
        if(dt_start != "Invalid Date" && dt_start != ""){
            scope._events.data_.dt_start_year = dt_start_j.jy;
            scope._events.data_.dt_start_month = dt_start_j.jm;
            scope._events.data_.dt_start_day = dt_start_j.jd;
            scope._events.data_.dt_start_hour = dt_start.getHours();
            scope._events.data_.dt_start_min = dt_start.getMinutes();
        }
        var dt_end = ev.long_to_date(Number(scope._events.data_.dt_end));
        var dt_end_j = toJalaali(dt_end);
        if(dt_end != "Invalid Date" && dt_end != ""){
            scope._events.data_.dt_end_year = dt_end_j.jy;
            scope._events.data_.dt_end_month = dt_end_j.jm;
            scope._events.data_.dt_end_day = dt_end_j.jd;
            scope._events.data_.dt_end_hour = dt_end.getHours();
            scope._events.data_.dt_end_min = dt_end.getMinutes();
        }
        
        var dt_reserve = ev.long_to_date(Number(scope._events.data_.dt_reserve));
        var dt_reserve_j = toJalaali(dt_reserve);
        if(dt_reserve != "Invalid Date" && dt_reserve != ""){
            scope._events.data_.dt_reserve_year = dt_reserve_j.jy;
            scope._events.data_.dt_reserve_month = dt_reserve_j.jm;
            scope._events.data_.dt_reserve_day = dt_reserve_j.jd;
            scope._events.data_.dt_reserve_hour = dt_reserve.getHours();
            scope._events.data_.dt_reserve_min = dt_reserve.getMinutes();
        }
        try{
            scope._events.data_.body = utf8_decode(atob(scope._events.data_.body));
        } catch(e){
            scope._events.data_.body = (scope._events.data_.body);
        }
    } catch(e) {

    }
    document.querySelector("#editor_event .ql-editor").innerHTML = scope._events.data_.body;
}
//////////////comments
ev.comments.action = function(){
    var state = 2;
    if(this.dataset.accept == "true") state = 1;
    scope.comments.data_.state = state;
    ev.set("comments");
}
//////////////categories
ev.categories.add_post = function(key){
    scope.categories.data_.parent = 0;
}

//////////////members
ev.members.wallet_add = function(){
    var x = scope.members.data_;
    scope.members.data_ = {};
    scope.members.data_.id = x.id;
    scope.members.data_.credit_toAdd = x.credit_toAdd;
    ev.set("members");
    setTimeout(function(){
        scope.members.tab = "base";
        ev.get_("members", x.id);
    }, 1000);
}
//////////////reserves
ev.reserves.edit = function(){
    var x = scope.reserves.data_;
    scope.reserves.data_ = {};
    scope.reserves.data_.id = x.id;
    scope.reserves.data_.count_new = x.count_new;
    ev.set("reserves");
    setTimeout(function(){
        scope.reserves.tab = "base";
        ev.get_("reserves", x.id);
    }, 1000);
}
//////////////locations
ev.locations.get_post = function(){
    Object.keys(scope.locations.data).forEach(k => {
        scope.locations.data[k] = JSON.parse(scope.locations.data[k]);
    });
}
//////////////users
ev.users.get__post = function (key) {
    // scope.users.data_.prm.forEach(perm => {
    //     perm.read = perm.value.slice(0, 1) == 1;
    //     perm.write = perm.value.slice(1) == 1;
    // });
    scope.users.data_.pwd = "";
}
ev.users.set_pre = function (key) {
    // scope.users.data_.prm.forEach(perm => {
    //     if(perm.read == true || perm.read == "checked"){
    //         perm.value = "1";
    //     } else {
    //         perm.value = "0";
    //     }
    //     if(perm.write == true || perm.write == "checked"){
    //         perm.value += "1";
    //     } else {
    //         perm.value += "0";
    //     }
    // });
    scope.users.data_.prm = btoa(JSON.stringify(scope.users.data_.prm));
    return true;
}

//////////////consts
ev.consts.get_pre = function() {
    ev.consts.get_();
    return false;
}
ev.consts.get_pos = function() {
    // scope.consts.data_.gw_addr_callback = atob(scope.consts.data_.gw_addr_callback);
}
ev.consts.get_ = function() {
    ev.get_("consts", "none");
}
ev.consts.set_pre = function() {
    scope.consts.data_.gw_addr_callback = btoa(scope.consts.data_.gw_addr_callback);
}
//////////////memberships
ev.memberships.set_pre = function(key){
    try {
        scope.memberships.data_.dt_end_ = ev.jdate_to_long(scope.memberships.data_.dt_end_year,
            scope.memberships.data_.dt_end_month,
            scope.memberships.data_.dt_end_day);
    } catch (x) {
        return false;
    }
    return true;
}
ev.memberships.get__post = function(key){
    try {
        var dt_end = ev.long_to_date(Number(new Date(scope.memberships.data_.dt_end)));
        var dt_end_j = toJalaali(dt_end);
        if(dt_end != "Invalid Date" && dt_end != ""){
            scope.memberships.data_.dt_end_year = dt_end_j.jy;
            scope.memberships.data_.dt_end_month = dt_end_j.jm;
            scope.memberships.data_.dt_end_day = dt_end_j.jd+1;
        }
    } catch(e) {
        return false;
    }
    return true;
}
//////////////logs
ev.sys_logs.get__post = function(key){
    try {
        document.querySelector("#form_sys_log_stack").innerHTML = scope.sys_logs.data_.stack;
    } catch(e) {
        return false;
    }
    return true;
}
////////////////////////////////////
ev.setColor = function () {
    scope[this.dataset.key].data_.color = this.dataset.color;
    this.parentElement.querySelectorAll('div').forEach(function (element) {
        element.classList.remove('true');
    });
    this.classList.add('true');
}

ev.file_to_base64 = function () {
    var filesSelected = this.files;
    var key1 = this.dataset.key;
    var key2 = this.dataset.prop;
    var key3 = this.dataset.prop2;
    var key4 = this.dataset.prop3;
    loading(true);
    if (filesSelected.length > 0) {
        var file = filesSelected[0];
        var file_reader = new FileReader();
        file_reader.onload = function (fileLoadedEvent) {
            if(key3)
                scope[key1].data_[key2][key3][key4] = (fileLoadedEvent.target.result); // <--- data: base64
            else
                scope[key1].data_[key2] = (fileLoadedEvent.target.result); // <--- data: base64
            loading(false);
        }
        file_reader.readAsDataURL(file);
    }
    try { //optional -> if file is image and .preveiw exist
        let img = this.parentElement.querySelector(".preview");
        img.src = "";
    } catch (x) {

    }
}

ev.img_show_modal = function () {
    var modal_selector = scope[this.dataset.key].modal_selector;
    document.querySelector(modal_selector).classList.add("true");
}

ev.img_set = function () {
    var modal_selector = scope[this.dataset.key].modal_selector;
    document.querySelector(modal_selector).classList.remove("true");
    scope[this.dataset.key].data_[this.dataset.prop] = this.dataset.d;
}

ev.set_chart_pie = function (selector, _title, _data) {
    if (selector == undefined) {
        console.log("set_chart_pie, selector is null");
        return;
    }
    if (_data == undefined) {
        console.log("set_chart_pie, _data is null");
        return;
    }
    var ctx = document.querySelector(selector).getContext('2d');
    var i = 0;
    var datasets_bgs = [];
    var datasets_data = [];
    var _labels = [];
    _data.forEach(item => {
        datasets_data.push(item.plays_count);
        datasets_bgs.push(scope.colors[i % scope.colors.length - 1]);
        _labels.push(item.price);
        i++;
    });
    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: datasets_data,
                backgroundColor: datasets_bgs,
                label: _title
            }],
            labels: _labels
        },
        options: {
            responsive: true,
        }
    };
    if (scope.charts.is_set == false)
        scope.charts[selector] = new Chart(ctx, config);
    else {
        scope.charts[selector].config = config;
        scope.charts[selector].update();
    }
}

ev.set_chart_line = function (selector, _title, _data) {
    var ctx = document.querySelector(selector).getContext('2d');
    var i = parseInt(Math.random() * scope.colors.length - 1) + 1;
    var config = {
        type: 'line',
        data: {
            labels: _data.x,
            datasets: [{
                label: _title,
                data: _data.y,
                backgroundColor: scope.colors[i],
                borderColor: scope.colors[i],
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: _title
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Day'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };

    if (scope.charts.is_set == false)
        scope.charts[selector] = new Chart(ctx, config);
    else {
        scope.charts[selector].config = config;
        scope.charts[selector].update();
    }
}

ev.drop_handle = function (e) {
    console.log('File(s) dropped');
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (e.dataTransfer.items[i].kind === 'file') {
                loading(true);
                var file = e.dataTransfer.items[i].getAsFile();
                var file_reader = new FileReader();
                file_reader.onload = function (fileLoadedEvent) {
                    scope.attachments.data_.data = fileLoadedEvent.target.result; // <--- data: base64
                    scope.attachments.data_.folder = "man";
                    scope.attachments.data_.alt = file.name;
                    scope.attachments.data_.title = file.name;
                    ev.set("attachments");
                    loading(false);
                }
                file_reader.readAsDataURL(file);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            loading(true);
            var file = e.dataTransfer.files[i];
            var file_reader = new FileReader();
            file_reader.onload = function (fileLoadedEvent) {
                scope.attachments.data_.data = fileLoadedEvent.target.result; // <--- data: base64
                scope.attachments.data_.folder = "man";
                scope.attachments.data_.alt = file.name;
                scope.attachments.data_.title = file.name;
                ev.set("attachments");
                loading(false);
            }
            file_reader.readAsDataURL(file);
        }
    }
}

ev.drag_handle = function (e) {
    e.preventDefault();
}
