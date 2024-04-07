//add to consts.js
scope.page = 1;
scope.pages = [];
scope.page_count = [];
scope.size = 0;
scope.sort_asc = 0;
scope.sort_key = "id";

ev.page_change = function () {
    scope[this.dataset.key].page = this.dataset.d;
    scope.skip = (scope[this.dataset.key].page - 1) * scope.preference_clients.take;
    if (this.dataset.prop && this.dataset.val) {
        // ev.get(this.dataset.key, this.dataset.prop, this.dataset.val);
        scope.prop = this.dataset.prop;
        scope.val = this.dataset.val;
    }
    ev.get(this.dataset.key);
}

function paginiation(key) {
    if (typeof key == "object")
        key = this.dataset.key;
    // trace("size: " + scope[key].size);
    var n = parseInt(scope[key].size / scope.preference_clients.take) + 1;
    if (isNaN(n)) return;
    scope[key].pages = [];
    scope[key].page = Number(scope[key].page);

    if (n == 3 && (scope[key].page == 3 || scope[key].page == 2)) scope[key].pages.push(1);

    if (!befp(n, scope[key].page) && scope[key].page > 3) scope[key].pages.push(scope[key].page - 1);
    if (scope[key].page > 2 && ((befp(n, scope[key].page) && scope[key].page - 2 != 1) || !befp(n, scope[key].page))) scope[key].pages.push(scope[key].page - 2);
    if (scope[key].page > 1 && ((befp(n, scope[key].page) && scope[key].page - 1 != 1) || !befp(n, scope[key].page))) scope[key].pages.push(scope[key].page - 1);

    scope[key].pages.push(scope[key].page);

    if (scope[key].page <= n - 1 && ((afp(n, scope[key].page) && scope[key].page + 1 != n) || !afp(n, scope[key].page))) scope[key].pages.push(scope[key].page + 1);
    if (scope[key].page <= n - 2 && ((afp(n, scope[key].page) && scope[key].page + 2 != n) || !afp(n, scope[key].page))) scope[key].pages.push(scope[key].page + 2);
    if (!afp(n, scope[key].page) && scope[key].page < n - 3) scope[key].pages.push(scope[key].page + 3);

    if (n == 3 && (scope[key].page == 1 || scope[key].page == 2)) scope[key].pages.push(3);

    scope[key].page_count = n;
    return scope[key].pages;
}

function afp(n, scope_page) {
    if (n > 3 && scope_page <= n - 2)
        return true;
    return false;
}

function befp(n, scope_page) {
    if (n > 3 && scope_page > 2)
        return true;
    return false;
}

ev.sort_set_listioner = function () {
    document.querySelectorAll("table thead th.cp").forEach(th => {
        try {
            th.addEventListener("click", function () {
                if (this.dataset == undefined || this.dataset.sort_key == undefined) return;
                scope.prop = null;
                scope.val = null;
                var key = this.dataset.sort_key;
                if (scope.sort_key == key) {
                    if (scope.sort_asc == 1) {
                        scope.sort_asc = 0;
                        this.querySelector("span").classList.add("desc");
                    } else {
                        scope.sort_asc = 1;
                        this.querySelector("span").classList.remove("desc");
                    }
                } else {
                    scope.sort_asc = 1;
                    this.querySelector("span").classList.remove("desc");
                }
                scope.sort_key = key;
                ev.get(th.parentElement.parentElement.dataset.key);
            });
        } catch (x) { }
    });
}

ev.set_tab = function () {
    if (this.classList.contains("disable")) return;
    scope[this.dataset.key].tab = this.dataset.tab;
    if (this.dataset.gkey && this.dataset.d) {
        scope.prop = this.dataset.prop;
        scope.val = this.dataset.d;
        ev.get(this.dataset.gkey, this.dataset.prop, this.dataset.d);
    }
}

ev.row_new = function () {
    if (scope[this.dataset.key][this.dataset.prop] == undefined) scope[this.dataset.key][this.dataset.prop] = [];
    var d = {};
    if (this.value)
        d[this.dataset.prop_] = this.value;
    scope[this.dataset.key][this.dataset.prop].push(d);
    this.value = undefined;
}

ev.row_del = function () {
    if (scope[this.dataset.key][this.dataset.prop] == undefined) return;
    if (this.dataset.id != undefined) {
        scope[this.dataset.key].data_.id = this.dataset.id;
        ev.delete(this.dataset.key);
    } else {
        scope[this.dataset.key][this.dataset.prop].splice(this.dataset.i, 1);
    }
    if (this.dataset.key == "invoice_stuffs") {
        ev.invoice_stuffs.calc_amount();
    }
    this.value = undefined;
}

ev.drag_handle = function (e) {
    e.preventDefault();
}

ev.file_to_base64_ = function () {
    var filesSelected = this.files;
    var key1 = this.dataset.key;
    var key2 = this.dataset.prop;
    if (filesSelected.length > 0) {
        var file = filesSelected[0];
        var file_reader = new FileReader();
        loading(true);
        file_reader.onload = function (fileLoadedEvent) {
            file.d = fileLoadedEvent.target.result; // <--- data: base64
            scope.attachments.data.push(file);
            loading(false);
        }
        file_reader.readAsDataURL(file);
    }
}

ev.dirtyNum_to_num = function (dirtyNum) {
    var str_ = "";
    dirtyNum = dirtyNum.toString();
    for (var i = 0; i < dirtyNum.length; i++) {
        if (!isNaN(dirtyNum[i])) str_ += dirtyNum[i];
    }
    return Number(str_);
}

ev.is_active = function () {
    if (document.activeElement != this) {
        this.value = "";
        return;
    };
    this.value = scope.search.s;
}

rivets.formatters.afp = afp;
rivets.formatters.befp = befp;

rivets.formatters.concat = function (a, b) {
    if (a == undefined) return b;
    if (b == undefined) return a;
    if (typeof a != "string") return b;
    if (typeof b != "string") return a;
    return a + " " + b;
}
rivets.formatters.parent_filter = function (arr, parent_prop, parent) {
    var res = [];
    arr.forEach(c => {
        if (c[parent_prop] == parent)
            res.push(c);
    });
    return res;
}
rivets.formatters.is_undefined = function (x) {
    return x == undefined;
}
rivets.formatters.divide = function (x, y) {
    if (x == undefined || y == undefined) return x;
    if (y == 0) return Infinity;
    return x / y;
}
rivets.formatters.slice = function (arr, start, end) {
    if (arr == undefined) return [];
    if (start == undefined || end == undefined) return [];
    return arr.slice(start, end);
}
rivets.formatters.sep3 = function (str) {
    if (str == undefined || str == null) return "";
    try {
        str = str.toString();
    } catch (x) {
        return "";
    }
    var is_negative = false;
    if(str[0] == "-") is_negative = true;
    str = (ev.dirtyNum_to_num(str)).toString();
    var set_i = str.length % 3;
    var res = "";
    for (var i = 0; i < str.length; i++) {
        if (i != 0 && i % 3 == set_i) res += ",";
        res += str[i];
    }
    if(is_negative) res = "-" + res;
    return res;
}