//#region login/register

/**
 * Sets location if location be available, otherwise set as empty string
 * 
 * @param {object} position
 * @param {object} scope.login from global var
 *
 * @return {boolean} (true/false) either inputs are valid or not.
 */
ev.location_get_response = function (position) {
    var location = {
        accuracy: position.coords.accuracy,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    };
    scope.login.location = JSON.stringify(location);
    scope.register.location = JSON.stringify(location);
    console.log(scope.login.location);
}
//#region register

/**
 * Checks register step 1 inputs.
 * 
 * @param {object} scope.register from global var
 *
 * @return {boolean} (true/false) either inputs are valid or not.
 */
ev.register_validation = function () {
    var success = true;
    if (!scope.register.username || scope.register.username == "") {
        scope.register.username_err = true;
        scope.register.username_err_txt = scope.lang.dictionary["Username is required."];
        success = false;
    }
    return success;
}

/**
 * Checks input and goes to next step
 * 
 * @param {object} scope.register from global var
 *
 * @return {void}
 */
ev.register = async function () {
    if (!ev.register_validation()) return;
    //register
    if (scope.is_sending) return;
    scope.is_sending = true;
    let d = params_to(scope.register);
    try {
        d = await fetch_(scope.url.server + "register", fetchd(d));
    } catch (ex) {
        toast(scope.lang.dictionary["Error while sending request; please check your network!"], -1);
        console.log("ev.register exception: " + ex.message);
        scope.is_sending = false;
        return;
    }
    scope.is_sending = false;
    d = params_from(d);
    if (d.success != true) {
        if (d.str && d.str != "") {
            scope.register.form_message = true;
            scope.register.form_message_txt = d.str;
        }
        return;
    }
    //success
    location.href = "/";
}
//#endregion

//#region forgot
/**
 * Checks forgot password step 1 inputs.
 * 
 * @param {object} scope.forgot from global var
 *
 * @return {boolean} (true/false) either inputs are valid or not.
 */
ev.forgot_validation_1 = function () {
    var success = true;
    if (!scope.forgot.email || scope.forgot.email == "") {
        scope.forgot.email_err = true;
        scope.forgot.email_err_txt = scope.lang.dictionary["Email is required."];
        success = false;
    }
    if (!validate_email(scope.forgot.email)) {
        scope.forgot.email_err = true;
        scope.forgot.email_err_txt = scope.lang.dictionary["Please enter a valid email."];
        success = false;
    }
    return success;
}

/**
 * Checks forgot password step 2 inputs.
 * 
 * @param {object} scope.forgot from global var
 *
 * @return {boolean} (true/false) either inputs are valid or not.
 */
ev.forgot_validation_2 = function () {
    var success = true;
    if (!scope.forgot.password || scope.forgot.password == "") {
        scope.forgot.password_err = true;
        scope.forgot.password_err_txt = scope.lang.dictionary["Password is required."];
        success = false;
    }
    if (!validate_password(scope.forgot.password)) {
        scope.forgot.password_err = true;
        scope.forgot.password_err_txt = scope.lang.dictionary["Please enter at lease 6 characters."];
        success = false;
    }
    if (!scope.forgot.password_confirm || scope.forgot.password_confirm == "") {
        scope.forgot.password_confirm_err = true;
        scope.forgot.password_confirm_err_txt = scope.lang.dictionary["Confirm Password is required."];
        success = false;
    }
    if (scope.forgot.password_confirm != scope.forgot.password) {
        scope.forgot.password_confirm_err = true;
        scope.forgot.password_confirm_err_txt = scope.lang.dictionary["Confirm Password is not match with password."];
        success = false;
    }
    return success;
}

/**
 * Sends user email to server to retrive reset password link.
 * 
 * @param {object} scope.forgot from global var.
 *
 * @return {void} shows proper message to user. 
 */
ev.forgot_step_1 = async function () {
    if (!ev.forgot_validation_1()) return;
    if (scope.is_sending) return;
    scope.is_sending = true;
    scope.self.key = scope.key_const;
    let d = {
        email: scope.forgot.email,
    };
    d = params_to(d);
    try {
        d = await fetch_(scope.url.server + "f115c70d69ed6ec7b7a3139afc1c5f54dfc0ed7c1c94bc47e07086bdcf450e88?iso=" + scope.register.lang, fetchd(d));
    } catch (ex) {
        toast(scope.lang.dictionary["Error while sending request; please check your network!"], -1);
        console.log("ev.forgot_step_1 exception: " + ex.message);
        scope.is_sending = false;
        return;
    }
    scope.is_sending = false;
    d = params_from(d);
    if (d.success != true) {
        if (d.str && d.str != "") {
            scope.forgot.form_message_1_success = false;
            scope.forgot.form_message_1 = true;
            scope.forgot.form_message_1_txt = d.str;
        }
        return;
    }
    //success
    scope.forgot.form_message_1 = true;
    scope.forgot.form_message_1_txt = d.str;
    scope.forgot.form_message_1_success = true;
}

/**
 * Sends new password and the given token to server to reset password.
 * 
 * @param {object} scope.forgot from global var.
 *
 * @return {void} shows proper message to user.
 */
ev.forgot_step_2 = async function () {
    if (!ev.forgot_validation_2()) return;
    if (scope.is_sending) return;
    scope.is_sending = true;
    scope.self.key = scope.key_const;
    let d = {
        password: scope.forgot.password,
        secret: scope.forgot.secret
    };
    d = params_to(d);
    try {
        d = await fetch_(scope.url.server + "f115c70d69ed6ec7b7a3139afc1c5f54dfc0ed7c1c94bc47e07086bdcf450e89?iso=" + scope.register.lang, fetchd(d));
    } catch (ex) {
        toast(scope.lang.dictionary["Error while sending request; please check your network!"], -1);
        console.log("ev.forgot_step_1 exception: " + ex.message);
        scope.is_sending = false;
        return;
    }
    scope.is_sending = false;
    d = params_from(d);
    if (d.success != true) {
        if (d.str && d.str != "") {
            scope.forgot.form_message_2_success = false;
            scope.forgot.form_message_2 = true;
            scope.forgot.form_message_2_txt = d.str;
        }
        return;
    }
    //success
    scope.forgot.form_message_2 = true;
    scope.forgot.form_message_2_txt = d.str;
    scope.forgot.form_message_2_success = true;
    setTimeout(function () {
        ev.set_value_do("login_section", 1);
    }, 2000);
}

//#endregion

//#region login

/**
 * Checks login inputs.
 * 
 * @param {object} scope.login from global var
 *
 * @return {boolean} (true/false) either inputs are valid or not.
 */
ev.login_request_validation = function () {
    var success = true;
    if (!scope.login.username || scope.login.username == "") {
        scope.login.username_err = true;
        scope.login.username_err_txt = "Please fill login name!";
        success = false;
    }
    return success;
}

/**
 * Validates form, then fetchs login_request with username to request a code for login.
 * 
 * @param {object} scope.login from global var
 *
 * @return {void} redirects on success, shows message on fail
 */
ev.login_request = async function () {
    if (!ev.login_request_validation()) {
        console.log("form error!");
        return;
    }
    if (scope.is_sending) return;
    scope.is_sending = true;
    // 
    d = JSON.stringify(scope.login);
    try {
        d = await fetch_(scope.url.server + "login_request", fetchd(d));
    } catch (ex) {
        toast(scope.lang.dictionary["Error while sending request; please check your network!"], -1);
        console.log("ev.login exception: " + ex.message);
        scope.is_sending = false;
        return;
    }
    scope.is_sending = false;
    d = JSON.parse(d);
    if (d.success == true) {
        scope.login_section = 2;
    } else {
        // toast("fail: " + d.msg, -1);
        scope.login.form_message = true;
        scope.login.form_message_txt = d.str;
    }
}

/**
 * Checks login inputs.
 * 
 * @param {object} scope.login from global var
 *
 * @return {boolean} (true/false) either inputs are valid or not.
 */
ev.login_validation = function () {
    var success = true;
    if (!scope.login.code || scope.login.code == "") {
        scope.login.code_err = true;
        scope.login.code_err_txt = "Please fill code!";
        success = false;
    }
    return success;
}

/**
 * Validates form, then fetchs login with credential.
 * 
 * @param {object} scope.login from global var
 *
 * @return {void} redirects on success, shows message on fail
 */
ev.login = async function () {
    if (!ev.login_validation()) {
        console.log("form error!");
        return;
    }
    if (scope.is_sending) return;
    scope.is_sending = true;
    d = params_to(scope.login);
    try {
        d = await fetch_(scope.url.server + "login", fetchd(d));
    } catch (ex) {
        toast(scope.lang.dictionary["Error while sending request; please check your network!"], -1);
        console.log("ev.login exception: " + ex.message);
        scope.is_sending = false;
        return;
    }
    scope.is_sending = false;
    d = params_from(d);
    if (d.success == true) {
        if (typeof d.data == "string") d.data = JSON.parse(d.data);
        scope.self = d.data.self;
        scope.self.token = d.data.token;
        var d_user = JSON.stringify(scope.self);
        var d_forward = {
            user: d_user,
        };
        location.href = "/";
    } else {
        // toast("fail: " + d.msg, -1);
        scope.login.form_message = true;
        scope.login.form_message_txt = d.str;
    }
}

ev.logout = logout;
//#endregion

//#endregion

//#region main: functions for binding rivets events

/**
 * Adds a contact.
 * 
 * @param {string} username from scope, text of message
 * 
 * @return {void}
 */
ev.contact_add = async function () {
    var d = {
        action: "contact_add",
        username: scope.contact.username
    }
    d = params_to(d);
    // 
    d = await fetch__(scope.url.server + "wind", fetchd(d));
    if (d.success != true) {
        if (d.str && d.str != "") {
            toast(d.str, -1);
        }
        return;
    }
    //success
    ev.modal_close_all();
    await ev.contact_get();
    ev.modal_show_do("modal_contacts");
}

/**
 * Gets all contact.
 * 
 * @param {string} username from scope, text of message
 * 
 * @return {void}
 */
ev.contact_get = async function () {
    var d = {
        action: "contact_get",
        username: scope.contact.username
    }
    d = params_to(d);
    // 
    d = await fetch__(scope.url.server + "wind", fetchd(d));
    if (d.success != true) {
        if (d.str && d.str != "") {
            toast(d.str, -1);
        }
        return;
    }
    //success
    scope.contacts = d.data;
}

/**
 * Sends a message, parameters are from scope variable.
 * 
 * @param {string?} txt from scope, text of message
 * @param {string?} attachment from scope, attahment of message, if any.
 * @param {number} type from scope, type of message.
 * 
 * @return {void}
 */
ev.message = async function () {
    var d = {
        action: "message",
        chat_id: scope.chat.id,
        text: scope.message.txt,
        type: scope.message.type ? scope.message.type : "0",
        attachment: scope.message.attachment ? scope.message.attachment : "",
        reply_id: scope.message.reply_id ? scope.message.reply_id : ""
    }
    d = params_to(d);
    // 
    d = await fetch__(scope.url.server + "wind", fetchd(d));
    if (d.success != true) {
        if (d.str && d.str != "") {
            toast(d.str, -1);
        }
        return;
    }
    //success
    scope.message.txt = "";
    $("#message_text").innerHTML = "";
    scope.chat = await ev.chat_get_or_add(scope.chat.id, scope.chat.username);
}

/**
 * Gets user info.
 * 
 * @param {string} username from scope, username
 * 
 * @return {void}
 */
ev.user_get_ = async function (username) {
    var d = {
        action: "user_get_",
        username: username
    }
    d = params_to(d);
    // 
    d = await fetch__(scope.url.server + "wind", fetchd(d));
    if (!d || d.success != true) {
        if (d.str && d.str != "") {
            toast(d.str, -1);
        }
        return null;
    }
    //success
    return d.data;
}

/**
 * Gets chat messages and info.
 * 
 * @param {string} id from scope, id
 * @param {string} username from scope, target username, required if id is null
 * 
 * @return {Promise<object>}
 */
ev.chat_get_or_add = async function (id, username) {
    var d = {
        action: "chat_get_or_add",
        id: id ? id : "",
        username: username ? username : ""
    }
    d = params_to(d);
    // 
    d = await fetch__(scope.url.server + "wind", fetchd(d));
    if (!d || d.success != true) {
        if (d.str && d.str != "") {
            toast(d.str, -1);
        }
        return null;
    }
    //success
    return d.data;
}

/**
 * Gets contact user info.
 * 
 * @param {string} id from scope, contact id
 * 
 * @return {void}
 */
ev.on_contact = async function () {
    // scope.user_info = await ev.user_get_(this.dataset.id);
    // ev.modal_show_do("modal_user_info");
    // 
    scope.chat = await ev.chat_get_or_add(this.dataset.chat_id, this.dataset.username);
    ev.modal_close_all();
}

/**
 * Gets user and complete chat info. 
 * 
 * @param {string} user_id from dataset, user id
 * 
 * @return {void}
 */
ev.on_content_header = async function () {
    //  if it's a user
    scope.user_info = await ev.user_get_(this.dataset.username);
    ev.modal_show_do("modal_user_info");
}

/**
 * Gets message text.
 * 
 * @return {void}
 */
ev.on_message_keyup = function () {
    if (this.innerText == "<br>" || this.innerText == "\n")
        this.innerText = "";
    scope.message.txt = this.innerText;
}


/**
 * Gets contact user info.
 * 
 * @param {string} id from scope, contact id
 * 
 * @return {void}
 */
ev.on_chat = async function () {
    scope.chat = await ev.chat_get_or_add(this.dataset.chat_id, this.dataset.username);
    $$("._item_chat_").forEach(item => {
        item.classList.remove("selected")
    });
    this.classList.add("selected");
    ev.modal_close_all();
}

/**
 * Opens user chat screen and make screen ready for chat.
 * 
 * @param {string} id from scope, contact id
 * 
 * @return {void}
 */
ev.on_send_message = async function () {
    scope.chat = await ev.chat_get_or_add(this.dataset.chat_id, this.dataset.username);
    ev.modal_close_all();
}
//#endregion

//#region autocomplete

/**
 * Gets a list of model by a specific value on keyup event.
 * After getting the result, rivets will bind the data to suggestion list automatically.
 * 
 * @param {string} value from dataset, value to search for.
 * @param {string} fkey from dataset, model key to search on.
 * @param {string} key from dataset, model key to assign result.
 * @param {string} prop_i from dataset, property index to assign result.
 * 
 * @return {void}
 */
ev.auto_keyup = async function (e) {
    if (e.which < 48 && (e.which != 13 && e.which != 8 && e.which != 46 && e.which != 32 && e.which != 38 && e.which != 40)) return;

    let value = this.value;
    if (!value || value.length < 2) return;
    let fkey = this.dataset.fkey;
    let key = this.dataset.key;
    let prop = this.dataset.prop;
    let prop2 = this.dataset.prop2;
    let prop_i = parseInt(this.dataset.prop_i);
    let prop__i = parseInt(this.dataset.prop__i);
    let prop_target;
    if (isNaN(prop__i)) {
        prop_target = scope[key].props_form[prop_i];
    } else {
        prop_target = scope[key].props_form[prop_i].data[prop__i];
    }
    if (e.which == 38 || e.which == 40) {
        ev.auto_change_selected(prop_target.data, e.which);
        return;
    }
    if (e.which == 13) {
        let i = ev.find_by_prop_value(prop_target.data, "active", true);
        if (i == -1) return;
        let autoc_active = $(".autoc_active");
        if (!autoc_active) return;
        let suggestion_selected = autoc_active.parentElement.querySelector('.autocomplete span.true');
        if (suggestion_selected) {
            suggestion_selected.click();
        }
        return;
    }
    // ev.keyup(null, this, 'ext');
    if (scope[key][prop][prop2] == null) scope[key][prop][prop2] = {};
    scope[key][prop][prop2]["title"] = this.value;
    scope[key][prop][prop2]["value"] = this.value;
    //
    await ev.get_prop_data(key, prop_target, fkey, value, fkey);
    ev.set_prop_all(prop_target.data, 'active', false);
    ev.set_prop_at(prop_target.data, 'active', 0, true);
}

/**
 * Sets the current active suggestion
 * 
 * @param {object} item either event from html event or the element sent from another function
 * @param {boolean|object} is_event either element from html event or boolean sent by another function
 * 
 * @return {void}
 */
ev.auto_select = function (e) {
    let item = this;
    let target = item.dataset.target;
    let key = item.dataset.key;
    let prop = item.dataset.prop;
    let prop2 = item.dataset.prop2;
    let prop_i = item.dataset.prop_i;
    let prop__i = item.dataset.prop__i;
    let prop_data = item.dataset.prop_data;
    let title = item.dataset.title;
    let value = item.dataset.value;
    if (prop2) {
        if (!scope[key][prop][prop2]) scope[key][prop][prop2] = {};
        scope[key][prop][prop2]["title"] = title;
        scope[key][prop][prop2]["value"] = value;
        $("#" + target).value = title;
        if (isNaN(prop__i))
            scope[key].props_form[prop_i].data = [];
        else
            scope[key].props_form[prop_i].data[prop__i].data = [];
    } else {
        scope[key][prop]["title"] = title;
        scope[key][prop]["value"] = value;
        if (prop_i)
            scope[key].props_form[prop_i].data = [];
        else
            scope[key][prop_data] = [];
    }
}

/**
 * Changes the selected suggestion by arrow down or arrow up
 * 
 * @param {Number} which user entered key(it should be 38 or 40, up or down)
 * @param {string} key from dataset, model key to assign result.
 * @param {string} prop from dataset, property to assign result.
 * @param {string} prop_i from dataset, property index to assign result.
 * 
 * @return {void}
 */
ev.auto_change_selected = function (arr, which) {
    if (arr.length == 0) return;
    let i = ev.find_by_prop_value(arr, "active", true);
    ev.set_prop_all(arr, 'active', false);
    if (i == -1) i = 0;
    let i_next = 0;
    if (which == 38) { //up
        i_next = i > 0 ? i - 1 : arr.length - 1;
    }
    if (which == 40) { //down
        i_next = (i + 1) % arr.length;
    }
    ev.set_prop_at(arr, "active", i_next, true);
}

//#endregion

//#region preference_clients
/**
 * Saves client side preferences in local storage.
 * 
 * @param {object} preference_clients from gloabal var, value to save in local storage.
 * 
 * @return {void}
 */
ev.set_preference_client = function () {
    if (scope.preference_clients.take < 1 || scope.preference_clients.take > 100) {
        var err = "Table rows must be in 1-100 range!";
        toast(err, -1);
        return;
    }
    localStorage.setItem("preference_clients", JSON.stringify(scope.preference_clients));
}

/**
 * Loads client side preferences from local storage.
 * 
 * @param {object} preference_clients from gloabal var, variable to assign.
 * 
 * @return {void}
 */
ev.get_preference_client = function () {
    scope.preference_clients = localStorage.getItem("preference_clients");
    if (scope.preference_clients == null || scope.preference_clients == undefined) {
        console.log("Setting preference_client to default!");
        scope.preference_clients = {};
        scope.preference_clients.take = 20;
        scope.preference_clients.filters_show = false;
        ev.set_preference_client();
        return;
    }
    scope.preference_clients = JSON.parse(scope.preference_clients);
}
//#endregion

//#region menu

/**
 * Shows menu.
 * 
 * @param {object} this from triggered event.
 * 
 * @return {void}
 */
ev.menu_show = function (e) {
    $("#menu").classList.add("true");
    $("#overlay").classList.add("true");
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Hides active popup visiblity.
 * 
 * @param {object} this from triggered event.
 * 
 * @return {void}
 */
ev.menu_hide = function (e) {
    if (e && e.target.classList.contains("click_ignore"))
        return;
    $("#menu").classList.remove("true");
    $("#overlay").classList.remove("true");
}
//#endregion

//#region popup
/**
 * Toggles active popup visiblity.
 * 
 * @param {object} this from triggered event.
 * 
 * @return {void}
 */
ev.top_popup_toggle = function (e) {
    $$(".top_popup").forEach(element => {
        if (element.id != this.dataset.el_id)
            element.classList.remove("true");
    });
    $("#" + this.dataset.el_id).classList.toggle("true");
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Hides active popup visiblity.
 * 
 * @param {object} this from triggered event.
 * 
 * @return {void}
 */
ev.top_popup_hide = function (e) {
    if (e.target.classList.contains("click_ignore")) return;
    $$(".top_popup").forEach(element => {
        element.classList.remove("true");
    });
}

/**
 * Hides active filter visiblity. Checks clicked item to be outside of filters form.
 * 
 * @param {object} this from triggered event.
 * @param {object} preference_clients from global var.
 * 
 * @return {void}
 */
ev.filter_hide = function (e) {
    if (e.target.classList.contains("click_ignore")) return;
    let filters = $$(".filters");
    for (let i = 0; i < filters.length; i++) {
        if (filters[i].contains(e.target)) return;
    }
    scope.preference_clients.filters_show = false;
}
//#endregion

//#region tools

/**
 * Adjusts textarea height to its content 
 * 
 * @param {string} file_id form dataset
 * 
 * @return {void}
 */
ev.textarea_adjust = function (e) {
    e.target.style.height = "1px";
    e.target.style.height = (e.target.scrollHeight) + "px";
}

/**
 * Finds the a element and simulate click on it, 
 * so automatically downloads the file for user
 * 
 * @param {string} file_id form dataset
 * 
 * @return {void}
 */
ev.file_get = function () {
    let file_id = this.dataset.file_id;
    $("#" + file_id).click();
}

/**
 * Finds the index of a model in array by a property value.
 * For example you can find the index of a first student with name(prop) Ali(val).
 * 
 * @param {any[]} arr the array to search in.
 * @param {any} prop the property to search for.
 * @param {any} val the value to find.
 * 
 * @return {Number} The index of matched row or -1 if nothing found.
 */
ev.find_by_prop_value = function (arr, prop, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][prop] == val)
            return i;
    }
    return -1;
}

/**
 * Sets a value to all elements of an array.
 * 
 * @param {any[]} arr the array to set.
 * @param {any} prop the property to be set.
 * @param {any} val the value to set.
 * 
 * @return {void}
 */
ev.set_prop_all = function (arr, prop, val) {
    for (let i = 0; i < arr.length; i++) {
        arr[i][prop] = val;
    }
}

/**
 * Sets a value to a property of an element of array at given index.
 * 
 * @param {any[]} arr the array to be set.
 * @param {any} prop the property to be set.
 * @param {Number} ind the index of element to be set.
 * @param {any} val the value to set.
 * 
 * @return {void}
 */
ev.set_prop_at = function (arr, prop, ind, val) {
    if (ind < arr.length) {
        arr[ind][prop] = val;
    }
}

/**
 * Clears variable binded to an input
 * 
 * @param {object} scope object, from global var
 * @param {string} key string, from dataset
 * @param {string} prop string, from dataset
 * @param {string} prop2 string, from dataset
 * @param {string} prop3 string, from dataset
 * 
 * @return {void}
 */
ev.clear_input = function () {
    let key = this.dataset.key;
    let prop = this.dataset.prop;
    let prop2 = this.dataset.prop2;
    let prop3 = this.dataset.prop3;
    if (!key || !prop) return;
    if (prop2 && prop3 && scope[key][prop][prop2][prop3]) {
        scope[key][prop][prop2][prop3] = "";
    } else if (prop2 && scope[key][prop][prop2]) {
        scope[key][prop][prop2] = "";
    } else {
        scope[key][prop] = "";
    }
}

/**
 * Toggles filters visibilty.
 * 
 * @param {object} scope from global var
 * 
 * @return {void}
 */
ev.filters_toggle = function (e) {
    let filters = $$(".filters");
    for (let i = 0; i < filters.length; i++) {
        if (filters[i].contains(e.target)) return;
    }
    scope.preference_clients.filters_show = !scope.preference_clients.filters_show;
}

/**
 * Clears filters inputs and dropdowns value.
 * 
 * @return {void}
 */
ev.filters_clear = function (e) {
    // let filters = $$(".filters");
    // for (let i = 0; i < filters.length; i++) {
    //     let inputs = filters[i].querySelectorAll("input");
    //     let selects = filters[i].querySelectorAll("select");
    //     inputs.forEach(el => {
    //         el.value = "";
    //     });
    //     selects.forEach(el => {
    //         el.value = el.querySelector("option").value;
    //     });
    // }
    let key = this.dataset.key;
    scope[key].props_filter.forEach(filter => {
        if (filter.filter == "true" && filter.v == "true") {
            scope[key].filter[filter.key] = "";
        }
    });
    scope[key].filter = JSON.parse(JSON.stringify(scope[key].filter)); //trigger rivets change
    scope[key].date_from = "";
    scope[key].date_to = "";
}

/**
 * Applies schema changes.
 * 
 * @param {string} key chat key
 * @param {string} schema new schema from server
 * @param {boolean} form_open is this happening from a form or not
 * @param {object} scope from global var
 * 
 * @return {Promise<void>}
 */
ev.schema_update = async function (key, schema, form_open = false) {
    if (!schema || schema.length < 20)
        return;
    schema = JSON.parse(schema);
    if (schema.change) {
        let change_key = schema.change;
        let action = schema.change_action;
        let data = schema.change_data;
        if (action == "g_") {
            chats.forEach(chat => {
                ev.form_close(chat.key);
            });
            $$('chat.content').forEach(element => {
                element.classList.add('none');
            });
            scope[change_key].data_ = data;
            scope[change_key].data_ = JSON.parse(JSON.stringify(scope[change_key].data_));
            $(scope[change_key].form_id).classList.add("true");
        }
        if (action == "g") {
            await ev.get(change_key);
            if (scope[change_key].has_table == "true") {
                $$('chat.content').forEach(element => {
                    element.classList.add('none');
                });
                $('#' + change_key).classList.remove('none');
            }
        }
    }
    if (schema.filter)
        scope[key].filter = schema.filter;
    if (schema.form_large && schema.form_large != "")
        scope[key].form_large = schema.form_large;
    if (schema.props_form)
        scope[key].props_form = schema.props_form;
    if (schema.props_table)
        scope[key].props_table = schema.props_table;
    if (schema.props_filter)
        scope[key].props_filter = schema.props_filter;
    if (schema.actions)
        scope[key].actions = schema.actions;
    if (schema.breadcrumbs)
        scope[key].breadcrumbs = schema.breadcrumbs;
    if (schema.add)
        scope[key].add = schema.add;
    if (schema.status) {
        scope[key].form_header.status = schema.status.status;
        scope[key].form_header.status_class = schema.status.status_class;
    } else {
        scope[key].form_header.status = "";
        scope[key].form_header.status_class = "";
    }
}

/**
 * Binds item value(view) to model.
 * Either item is the current element, or it can be send from another function.
 * 
 * @param {object} e user triggered event
 * @param {object} item new schema from server
 * @param {string|null} src is this happening from a form or not
 * 
 * @return {void}
 */
ev.keyup = async function (e, item, src) {
    // ///////////////
    if (!src || src != 'ext')
        item = this;
    //
    if (item.dataset["override"] == 'false')
        return;
    //
    if (item.classList && item.classList.contains("disabled"))
        return;

    var value = item.value;
    if (item.type == "checkbox") {
        value = item.checked;
    }
    if (item.type == "radio") {
        value = item.value;
        if (item.value == "on")
            value = true;
        if (item.value == "off")
            value = false;
    }
    if (item.classList && item.classList.contains("_file_")) {
        const value_ = await file_to_base64(item.files[0]);
        value = value_;
        item.type = "text";
        item.type = "file";
    }
    /// ///////////////
    var key = item.dataset.key;
    var prop = item.dataset["prop"];
    var prop2 = item.dataset["prop2"];
    var prop3 = item.dataset["prop3"];
    var prop4 = item.dataset["prop4"];
    var prop5 = item.dataset["prop5"];
    var prop6 = item.dataset["prop6"];
    var push = item.dataset["push"];
    //
    var type = item.dataset["type"];
    if (type == "autoc") {
        return;
    }
    if (type == 'arr_chk') {
        if (!scope[key][prop][prop2])
            scope[key][prop][prop2] = [];
        for (let i = 0; i < scope[key][prop][prop2].length; i++) {
            if (scope[key][prop][prop2][i].key == prop3) {
                scope[key][prop][prop2][i].value = value;
                break;
            }
        }
        return;
    }
    if (type == 'inner') {
        var fkey = item.dataset.fkey;
        scope[key][prop] = scope[key].draft;
        scope[key][prop].d_parent = scope[fkey].data_.id;
    }
    if (type == "card_number") {
        value = rivets.formatters.sep4(value);
    }
    //
    if (push && push == "true") {
        var d = item.dataset.d;
        if (prop2 != undefined && prop3 != undefined && _true(scope[key][prop]) && _true(scope[key][prop][prop2])) {
            if (!scope[key][prop][prop2][prop3] || typeof scope[key][prop][prop2][prop3] != "object")
                scope[key][prop][prop2][prop3] = [];
            if (value == true) {
                scope[key][prop][prop2][prop3].push(d);
            } else {
                array_remove(scope[key][prop][prop2][prop3], d);
            }

        } else if (prop2 != undefined && _true(scope[key][prop])) {
            if (!scope[key][prop][prop2] || typeof scope[key][prop][prop2] != "object")
                scope[key][prop][prop2] = [];
            if (value == true) {
                scope[key][prop][prop2].push(d);
            } else {
                array_remove(scope[key][prop][prop2], d);
            }
        } else {
            if (!scope[key][prop] || typeof scope[key][prop] != "object")
                scope[key][prop] = [];
            if (value == true) {
                scope[key][prop].push(d);
            } else {
                array_remove(scope[key][prop], d);
            }
        }
        return;
    }
    if (key && prop != undefined && _true(scope[key])) {
        if (prop2 != undefined && prop3 != undefined && prop4 != undefined && prop5 != undefined && prop6 != undefined &&
            _true(scope[key][prop]) && _true(scope[key][prop][prop2]) && _true(scope[key][prop][prop2][prop3]) &&
            _true(scope[key][prop][prop2][prop3][prop4]) && _true(scope[key][prop][prop2][prop3][prop4][prop5]))
            scope[key][prop][prop2][prop3][prop4][prop5][prop6] = value;

        else if (prop2 != undefined && prop3 != undefined && prop4 != undefined && prop5 != undefined &&
            _true(scope[key][prop]) && _true(scope[key][prop][prop2]) && _true(scope[key][prop][prop2][prop3]) && _true(scope[key][prop][prop2][prop3][prop4]))
            scope[key][prop][prop2][prop3][prop4][prop5] = value;

        else if (prop2 != undefined && prop3 != undefined && prop4 != undefined &&
            _true(scope[key][prop]) && _true(scope[key][prop][prop2]) && _true(scope[key][prop][prop2][prop3]))
            scope[key][prop][prop2][prop3][prop4] = value;

        else if (prop2 != undefined && prop3 != undefined && _true(scope[key][prop]) && _true(scope[key][prop][prop2]))
            scope[key][prop][prop2][prop3] = value;

        else if (prop2 != undefined && _true(scope[key][prop]))
            scope[key][prop][prop2] = value;

        else scope[key][prop] = value;
    }
    if (type == "card_number") {
        item.value = value;
    }
    if (type == 'inner') {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            item.value = "";
            let btn = item.parentElement.querySelector("button");
            if (btn) {
                btn.click();
            }
        }
    }
    if (item.dataset["schema_reload"] == 'true') {
        ev.add(key, false, value, null);
    }
    //
    if (item.classList && item.classList.contains("_file_")) {
        scope[key][prop] = JSON.parse(JSON.stringify(scope[key][prop]));
    }
}

/**
 * Binds radio button value(view) to model.
 * 
 * @param {object} e user triggered event
 * 
 * @return {void}
 */
ev.radio_change = function (e) {
    // ///////////////
    let item = this;
    value = item.value;
    if (item.value == "on")
        value = true;
    if (item.value == "off")
        value = false;
    /// ///////////////
    var key = item.dataset.key;
    var prop = item.dataset["prop"];
    var prop2 = item.dataset["prop2"];
    var prop3 = item.dataset["prop3"];
    var prop4 = item.dataset["prop4"];
    //
    if (key && prop != undefined && _true(scope[key])) {
        scope[key][prop][prop2].forEach(item => {
            item[prop4] = false;
        });
        scope[key][prop][prop2][prop3][prop4] = value;
    }
}

/**
 * Stops entering a character to input.
 * 
 * Also checks shift key holded or not. 
 * If check_shift be true and shift key pressed, then it wont prevent that key.
 * 
 * @param {object} e user triggered event
 * @param {object} item new schema from server
 * @param {string|null} src is this happening from a form or not
 * 
 * @return {void}
 */
ev.disallow_char = function (e) {
    let check_shift = this.dataset.check_shift == "true";
    if (e.which == parseInt(this.dataset.char)) {
        if (check_shift && e.shiftKey) return;
        e.preventDefault();
    }
}

/**
 * Simulate clicking on an input file.
 * 
 * @return {void}
 */
ev.change_src = function (e) {
    this.parentElement.querySelector("._file_").click();
}

/**
 * Pushes one keyvalue object to array
 * 
 * @param {string} key from dataset
 * @param {string} prop from dataset
 * @param {string} prop2 from dataset
 * 
 * @return {void}
 */
ev.arr_push = function () {
    var key = this.dataset.key;
    var prop = this.dataset.prop;
    var prop_key = this.dataset.prop_key;
    var props_key = this.dataset.props_key;
    var prop_i = this.dataset.prop_i;
    let obj_keys = [];
    let prop_data = scope[key][props_key][prop_i].data;
    prop_data.forEach(item => {
        obj_keys.push(item.key);
    });
    var obj = {};
    obj_keys.forEach(obj_key => {
        let item_key = rivets.formatters.concat_(prop_key, obj_key);
        obj[obj_key] = scope[key][prop][item_key];
    });
    if (!scope[key][prop][prop_key])
        scope[key][prop][prop_key] = [];
    if (!ev.validate(prop_data, obj)) {
        return;
    }
    obj_keys.forEach(obj_key => {
        let item_key = rivets.formatters.concat_(prop_key, obj_key);
        scope[key][prop][item_key] = null;
        $("#" + item_key).value = "";
    });
    scope[key][prop][prop_key].push(obj);
    scope[key][props_key][prop_i]["err"] = null;
    scope[key][prop] = JSON.parse(JSON.stringify(scope[key][prop]));
}

/**
 * Pops an element from array at give index.
 * 
 * @param {string} key from dataset
 * @param {string} prop from dataset
 * @param {string} prop2 from dataset
 * @param {string} prop3 from dataset
 * @param {Number} i from dataset
 * 
 * @return {void}
 */
ev.arr_pop = function () {
    var key = this.dataset.key;
    var prop = this.dataset.prop;
    var prop2 = this.dataset.prop2;
    var prop3 = this.dataset.prop3;
    var i = this.dataset.i;
    if (!key || !prop || !i) return;
    i = parseInt(i);
    if (prop2 && prop3)
        scope[key][prop][prop2][prop3].splice(i, 1);
    else if (prop2)
        scope[key][prop][prop2].splice(i, 1);
    else
        scope[key][prop].splice(i, 1);
    scope[key][prop] = JSON.parse(JSON.stringify(scope[key][prop]));
}

/**
 * Push an empty element to array at give index.
 * 
 * @param {string} key from dataset
 * @param {string} prop from dataset
 * @param {string} prop2 from dataset
 * @param {string} prop3 from dataset
 * @param {Number} i from dataset
 * 
 * @return {void}
 */
ev.arr_push_empty = function () {
    var key = this.dataset.key;
    var prop = this.dataset.prop;
    var prop2 = this.dataset.prop2;
    var prop3 = this.dataset.prop3;
    var i = this.dataset.i;
    if (!key || !prop || !i) return;
    i = parseInt(i);
    if (prop2 && prop3)
        scope[key][prop][prop2][prop3].splice(i + 1, 0, {});
    else if (prop2)
        scope[key][prop][prop2].splice(i + 1, 0, {});
    else
        scope[key][prop].splice(i + 1, 0, {});
    scope[key][prop] = JSON.parse(JSON.stringify(scope[key][prop]));
}

/**
 * Sets value to certain variable
 * 
 * @param {string} key from dataset
 * @param {string} prop1 from dataset
 * @param {string} prop2 from dataset
 * 
 * @return {void}
 */
ev.set_value = function (e) {
    if (this.dataset.pd != "false") e.preventDefault();
    if (e.keyCode == 13) {
        return false;
    }
    var key = this.dataset.key;
    var prop1 = this.dataset.prop1;
    var prop2 = this.dataset.prop2;
    var value = this.dataset.val;
    if (!key) return;
    if (!value || value == undefined) value = false;
    ev.set_value_do(key, value, prop1, prop2);
}

/**
 * Sets value to certain variable (diffrent parameters)
 * 
 * @param {string} key from dataset
 * @param {string} prop1 from dataset
 * @param {string} prop2 from dataset
 * 
 * @return {void}
 */
ev.set_value_ = function (e) {
    var key = this.dataset.key;
    var prop1 = this.dataset.prop1_sv;
    var prop2 = this.dataset.prop2_sv;
    var prop3 = this.dataset.prop3_sv;
    var prop4 = this.dataset.prop4_sv;
    var prop5 = this.dataset.prop5_sv;
    var prop6 = this.dataset.prop6_sv;
    var value = this.dataset.val;
    if (!key) return;
    if (!value || value == undefined) value = false;
    ev.set_value_do(key, value, prop1, prop2, prop3, prop4, prop5, prop6);
}

/**
 * Sets value to dynamic left hand side.
 * 
 * @param {string} key
 * @param {any} value
 * @param {string} prop1
 * @param {string} prop2
 * 
 * @return {void}
 */
ev.set_value_do = function (key, value, prop1, prop2, prop3, prop4, prop5, prop6) {
    if (!key) return;
    if (prop6) {
        scope[key][prop1][prop2][prop3][prop4][prop5][prop6] = value;
        return;
    }
    if (prop5) {
        scope[key][prop1][prop2][prop3][prop4][prop5] = value;
        return;
    }
    if (prop4) {
        scope[key][prop1][prop2][prop3][prop4] = value;
        return;
    }
    if (prop3) {
        scope[key][prop1][prop2][prop3] = value;
        return;
    }
    if (prop2) {
        scope[key][prop1][prop2] = value;
        return;
    }
    if (prop1) {
        scope[key][prop1] = value;
        return;
    }
    scope[key] = value;
}

/**
 * Changes chat when clicking on diffrent sidebar item.
 * 
 * @param {string | Event} e from dataset
 * @param {string} wrapper from dataset
 * 
 * @return {Promis<void>}
 */
ev.onchat = async function (e, prop, val, sidebar) {
    var item, key;
    if (typeof e == "object") {
        key = this.dataset.key;
        val = prop = null;
        if (!this.dataset.sidebar) {
            item = this;
        } else {
            sidebar = this.dataset.sidebar;
            item = $('#aside_item_' + sidebar);
        }
    } else {
        key = e;
        item = $('#aside_item_' + sidebar);
    }
    //hide all forms
    //remove all true classes ~ hide all chats
    //add true class to item ~ show current chat
    //add true class to wrapper ~ active the wrapper item of clicked menu 
    if (typeof e == "object") {
        for (var i = 0; i < chats.length; i++) {
            chats[i].aside_active = false;
            if (chats[i].key == key || (chats[i].wrap == "wrapper" && item.dataset.wrapper == chats[i].key))
                chats[i].aside_active = true;
            if (item.dataset.wrapper == "wrapper") {
                if (chats[i].wrap == key) { //set value false for all inner items
                    chats[i].is_aside_wrapper_close = false;
                } else if (chats[i].wrap != "wrapper")
                    chats[i].is_aside_wrapper_close = true;
            }
        }
    }
    if (item.dataset.wrap_main == "true") {
        return;
    }
    if (scope[key].sidebar) {
        scope[scope[key].sidebar].aside_active = true;
    }
    $$(".form").forEach(f => {
        f.classList.remove("true");
    });
    if (scope[key].has_table == "false") {
        await ev.get_(key, "");
    } else if (scope[key].page != 1 || chat_current != key || scope.last_action == "g_") {
        scope.pages = [];
        scope.search.s = "";
        scope.search.s_ = "";
        scope.rows_total = 0;
        scope.prop = null;
        scope.val = null;
        await ev.get(key, prop, val);
    }
    $$('chat.content').forEach(element => {
        element.classList.add('none');
    });
    if (scope[key].has_table == "true") {
        $('#' + key).classList.remove('none');
        if ($('#' + key + " .table"))
            $('#' + key + " .table").classList.remove('none');
    }
    document.documentElement.scrollTo(0, 0);
    chat_current = key;
}

/**
 * Closes form when clicking outside the form.
 * 
 * @param {string} key from dataset
 * @param {string} wrapper from dataset
 * 
 * @return {void}
 */
ev.onform = function (e) {
    if (uploading) return;
    if (e.target.classList.contains("inside"))
        return;
    if (e.button !== 0)
        return;
    if (e.target.classList.contains("form"))
        ev.form_close(this.dataset.key);
}

/**
 * Clears textarea value.
 * 
 * @param {string} ta_id from dataset, the id of textarea
 * 
 * @return {void}
 */
ev.textarea_clear = function () {
    let ta_id = this.dataset.ta_id;
    let ta = $("#" + ta_id);
    ta.value = "";
}

/**
 * Adds a keyvalue to collection.
 * 
 * @param {string} key from dataset, the id of textarea
 * @param {string} prop from dataset, the id of textarea
 * @param {string} prop2 from dataset, the id of textarea
 * 
 * @return {void}
 */
ev.addkey = function () {
    var key = this.dataset.key;
    var prop = this.dataset.prop;
    var prop2 = this.dataset.prop2;
    if (!scope[key][prop][prop2])
        scope[key][prop][prop2] = [];
    else
        scope[key][prop][prop2].push({
            Key: '',
            Value: ''
        });
    scope[key][prop] = JSON.parse(JSON.stringify(scope[key][prop]));
}

/**
 * Adds a keyvalue to collection.
 * 
 * @param {number} d from dataset, page number
 * @param {string} key from dataset, chat key
 * 
 * @return {void}
 */
ev.page_change = function () {
    scope[this.dataset.key].page = this.dataset.d;
    ev.get(this.dataset.key);
}

/**
 * Converts user selected file(s) to base64 data.
 * 
 * @param {string} fkey from dataset, file chat key
 * @param {boolean} set from dataset, either set file (send file to server) immediately or not.
 * 
 * @return {void}
 */
ev.files_to_base64 = async function () {
    if (uploading) return;
    let files = this.files;
    if (files.length == 0) return;
    // 
    let res = await get_uploading_files(files);
    this.type = "text";
    this.type = "file";
    if(!scope.message.files || !scope.message.files.length)
        scope.message.files = [];
    scope.message.files = scope.message.files.concat(res);
    ev.modal_show_do("modal_files", false);
    console.log("in ev.files_to_base64, files: " + files.length);
    console.log(res);
}

/**
 * Simulates input on click.
 * 
 * @return {void}
 */
ev.files_add = async function () {
    $("#message_file").click();
}

/**
 * Deletes one file from current files list.
 * @param {Number} i from dataset, file index
 * 
 * @return {void}
 */
ev.files_delete = function(){
    let i = parseInt(this.dataset.i);
    scope.message.files.splice(i, 1);
    if(scope.message.files.length == 0)
        ev.modal_close_files();
}

/**
 * Applies user upload abort to the UI and the worker
 * 
 * @return {void}
 */
ev.upload_abort = function () {
    let fkey = this.dataset.fkey;
    let msg = {
        action: "upload",
        data: {
            signal: "abort",
            i: scope[fkey].progress_i
        }
    };
    worker.postMessage([msg]);
}

/**
 * Converts user dropped file(s) to base64 data and sets them immediately
 * 
 * @param {number} fkey from dataset, file chat key
 * @param {number} key from dataset, current chat key
 * @param {string} prop from dataset
 * @param {string} prop2 from dataset
 * @param {string} d_parent from dataset, parent key
 * 
 * @return {void}
 */
ev.drop_handle = async function (e) {
    if (uploading) return;
    console.log('File(s) dropped');
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    let d_parent = this.dataset.d_parent;
    let key = this.dataset.key;
    let fkey = this.dataset.fkey;
    let prop = this.dataset.prop;
    let prop2 = this.dataset.prop2;
    let set_imm = this.dataset.set_imm != "false";

    let files = [];
    if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
            if (e.dataTransfer.items[i].kind === 'file') {
                var file = e.dataTransfer.items[i].getAsFile();
                files.push(file);
            }
        }
    } else {
        files = e.dataTransfer.files;
    }
    if (files.length == 0) return;
    let res = await get_uploading_files(files, true);
    if (prop2) {
        if (!scope[fkey][prop][prop2]) scope[fkey][prop][prop2] = [];
        scope[fkey][prop][prop2] = scope[fkey][prop][prop2].concat(res);
    } else {
        if (!scope[fkey][prop]) scope[fkey][prop] = [];
        scope[fkey][prop] = scope[fkey][prop].concat(res);
    }
    console.log(res.length + ' File(s) converted!');
    if (!key || key == undefined || key == "" || key == null) return;
    if (set_imm) {
        ev.set_multiple(res, key, fkey, d_parent);
    } else {
        ev.data__reload(fkey);
    }
}

/**
 * Sets multiple entity and calls get_ at the end of function.
 * 
 * @param {object[]} arr from dataset, file data in array 
 * @param {string} fkey from dataset, files chat key
 * @param {string} key from dataset, current chat key
 * @param {string} d_parent from dataset, parent key
 * 
 * @return {Promise<void>}
 */
ev.set_multiple = async function (data, key, fkey, d_parent) {
    let get_ = false;
    for (let i = 0; i < data.length; i++) {
        scope[key].data_ = data[i];
        scope[key].data_.d_parent = d_parent;
        if (i == data.length - 1) {
            get_ = {
                key: fkey
            };
        }
        await ev.set(key, false, get_, true, fkey);
    }
}

/**
 * reload the chat data_ object
 * 
 * @param {string} fkey key of chat
 * 
 * @return {void}
 */
ev.data__reload = function (fkey) {
    scope[fkey].data_ = JSON.parse(JSON.stringify(scope[fkey].data_));
}

/**
 * delete an item from the chat data_ object
 * 
 * @param {Number} i index of item
 * @param {string} fkey key of chat
 * @param {string} prop name of property with type of array
 * 
 * @return {void}
 */
ev.data__remove = function (i, fkey, prop) {
    scope[fkey].data_[prop].splice(parseInt(i), 1);
    ev.data__reload(fkey);
}

/**
 * Prevents draging from default behavior.
 * 
 * @return {void}
 */
ev.drag_handle = function (e) {
    e.preventDefault();
}

/**
 * Toggles menu between thin and normal widths.
 * 
 * @return {void}
 */
ev.menu_toggle = function () {
    $("#main").classList.toggle("expand");
}

/**
 * Toggles menu between thin and normal widths.
 * 
 * @param {string} key, chat key
 * @param {string} prop, property key
 * 
 * @return {void}
 */
ev.find_prop = function (key, prop) {
    for (let j = 0; j < scope[key].props_form.length; j++) {
        if (scope[key].props_form[j].key == prop)
            return scope[key].props_form[j];
    }
    for (let j = 0; j < scope[key].props_table.length; j++) {
        if (scope[key].props_table[j].key == prop)
            return scope[key].props_table[j];
    }
    for (let j = 0; j < scope[key].props_filter.length; j++) {
        if (scope[key].props_filter[j].key == prop)
            return scope[key].props_filter[j];
    }
    return null;
}

/**
 * Switch among modules.
 * 
 * @return {void}
 */
ev.modules_change = function () {

}

/**
 * Sets modal details and display it.
 * 
 * @param {string} header from dataset, modal header text.
 * @param {string} body from dataset, modal body text.
 * 
 * @return {void}
 */
ev.modal_text_set = function () {
    let modal = $("#modal_text");
    modal.querySelector(".header_text").innerText = this.dataset.header;
    modal.querySelector(".body").innerText = this.dataset.body;
    modal.querySelector(".form").classList.add("true");
    modal.classList.add("true");
}

/**
 * Hides modal.
 * 
 * @param {string} modal_id from dataset, modal id.
 * 
 * @return {void}
 */
ev.modal_close = function () {
    let modal = $("#" + this.dataset.modal_id);
    modal.classList.remove("true");
}

/**
 * Hides the files modal.
 * 
 * @return {void}
 */
 ev.modal_close_files = function () {
    scope.message.files = [];
    $("#modal_files").classList.remove("true");
}

/**
 * Closes the modal if it clicks out of modal inner 
 * 
 * @return {void}
 */
ev.modal_close_listener = function (e) {
    if (!e.target.classList.contains("modal") || scope.modal_cancelable == false)
        return;
    ev.modal_close_all();
}

/**
 * Hides all modal.
 * 
 * @param {string} modal_id from dataset, modal id.
 * 
 * @return {void}
 */
ev.modal_close_all = function (e) {
    $$(".modal").forEach(el => {
        el.classList.remove("true");
    });
}

/**
 * Shows a modal.
 * 
 * @param {string} modal_id from dataset var, modal id.
 * 
 * @return {void}
 */
ev.modal_show = function () {
    ev.modal_show_do(this.dataset.modal_id);
}

/**
 * Shows a modal.
 * 
 * @param {string} modal_id modal id.
 * 
 * @return {void}
 */
ev.modal_show_do = function (modal_id, cancelable) {
    ev.menu_hide();
    ev.modal_close_all();
    let modal = $("#" + modal_id);
    modal.classList.add("true");
    scope.modal_cancelable = cancelable;
}

/**
 * Sets default image to img element. This function calls on image load error and shows an default image.
 * 
 * @param {string} src from dataset, optional source for assignment.
 * 
 * @return {void}
 */
ev.img_def = function () {
    if (this.dataset.src) {
        this.src = this.dataset.src;
    } else {
        this.src = img_def;
    }
}

/**
 * Copies value to clipboard
 * 
 * @param {string} data from dataset, text to copy to clipboard
 * 
 * @return {void}
 */
ev.copy = function (e) {
    var _this = this;
    e.stopPropagation();
    if (copy_to_clipboard(this.dataset.data)) {
        _this.classList.add("color_success");
        _this.style.fontSize = "1.75em";
        setTimeout(function () {
            _this.classList.remove("color_success");
            _this.style.fontSize = "";
        }, 1000);
    }

}
//#endregion

//#region worker

//document from here

/**
 * Handles the worker messages
 * Checks message action and calls proper function
 * 
 * @param {object} e
 * 
 * @return {void}
 */
ev.worker_handle = function (e) {
    var data = e.data;
    // if(data.data && data.data.signal)
    //     console.log("data.data.signal: " + data.data.signal);
    if (data.action == "upload") {
        ev.worker_handle_upload(data);
    } else if (data.action == "params_to") {
        ev.worker_handle_params_to(data);
    } else if (data.action == "consts_init") {
        params_from_handle_code(data.data.preference);
        if (data.data == null)
            consts_init_from_worker_failed(data.str);
        else {
            console.log(data.data);
            consts_init_from_worker(data.data.preference, data.data.chats, data.data.contacts, data.data.settings);
        }
    }
}

/**
 * Handles the worker upload progress
 * 
 * @param {object} data contains progress status and values.
 * 
 * @return {void}
 */
ev.worker_handle_upload = function (data) {
    let fkey = data.data.fkey;
    if (data.data.signal == "start") {
        scope[fkey].progress_i = data.data.i;
        scope[fkey].uploading = true;
        scope[fkey].progress_text = scope[fkey].progress_value = "0%";
    } else if (data.data.signal == "progress") {
        let progress = data.data.progress;
        scope[fkey].progress_text = scope[fkey].progress_value = (progress + "%");
    } else if (data.data.signal == "end") {
        uploading = false;
        let key = data.data.key;
        let info = data.data.info;
        let d = data.data.d;
        scope[fkey].uploading = false;
        scope[fkey].progress_i = null;
        loading(false, key);
        ev.set_post(d, key, info.get, info.get__key, info.get_);
    } else if (data.data.signal == "error") {
        uploading = false;
        let status = data.data.status;
        scope[fkey].uploading = false;
        scope[fkey].progress_i = null;
        toast(scope.lang.dictionary["Failed to upload, please try again."], -1);
        if (status)
            console.log("error, status: " + status);
    } else if (data.data.signal == "abort") {
        uploading = false;
        scope[fkey].uploading = false;
        scope[fkey].progress_i = null;
        toast(scope.lang.dictionary["Upload aborted!"], -1);
    }
}
/**
 * Handles the worker parameters convert.
 * 
 * @param {object} data converted response
 * 
 * @return {void}
 */
ev.worker_handle_params_to = function (data) {
    let key = data.data.key;
    let fkey = data.data.fkey;
    let res = data.data.res;
    res.d = data.data.d;
    ev.set(key, null, null, null, fkey, false, res);
}
//#endregion

//#endregion

//#region custom binders
rivets.binders['style-*'] = function (el, value) {
    el.style.setProperty(this.args[0], value);
};
rivets.binders['_bind-*'] = function (el, val) {
    if (val == undefined) return;
    var dd = this.args[0];
    if (dd == 'd' && el.type != "radio") {
        el.value = val;
    } else
        el[dd] = val;
    if (dd == 'src') {
        if (val == undefined || val == "1") el.classList.add("none");
        else el.classList.remove("none");
        el.value = val;
    }
    if (el.type == "checkbox") {
        if (!chk_val(val)) {
            el.value = false;
            el.checked = false;
        } else {
            el.value = true;
            el.checked = true;
        }
    }
    if (el.type == "radio") {
        if (!chk_val(val)) {
            el.checked = false;
            el.dataset.checked = false;
        } else {
            el.checked = true;
            el.dataset.checked = true;
        }
    }
};
rivets.binders['on-_enter'] = function (el, f) {
    if (this.which == 13 && !this.shiftKey)
        ev.set(el.dataset.key, el.dataset.get == "true", el.dataset.get_ == "true", false);
}

rivets.binders['_placeholder'] = function (el, val) {
    el.placeholder = val;
}
rivets.binders['if_'] = function (el, val) {
    if (el == null || val == undefined) return null;
    // if(el.parentElement == null) {
    //     console.log(el);
    //     return;
    // }
    if (val == false || val == "false" || val == undefined) {
        // console.log(el);
        // console.log(val);
        // console.log(this.args);
        el = $("#" + el.id);
        if (el == null) {
            return null;
        }
        el.parentElement.removeChild(el);
    }
    return null;
};

rivets.binders['get_or_new_id'] = function (el, data_) { //this function changes next input element id
    if (!data_ || data_ == null) return;
    if (data_.id != undefined && data_.id != null && data_.id != "") {
        el.htmlFor = data_.id;
        el.dataset.d_parent = data_.id;
        el.nextElementSibling.id = data_.id;
        return;
    }
    var id_new = "id__" + (new Date()).getTime().toString();
    el.htmlFor = id_new;
    el.dataset.d_parent = id_new;
    el.nextElementSibling.id = id_new;
}

//#endregion

//#region formatters: read rivets guidline to understand formatters
rivets.formatters.div = function (x, y) {
    if (x == undefined || y == undefined || y == 0) return 0;
    return x / y;
}
rivets.formatters.percentage = function (c, arr) {
    if (c == undefined || arr == undefined || arr.length == 0) return 0;
    return (((c - 1) / (arr.length - 1)) * 100) + "%";
}
rivets.formatters.parse = function (x) {
    if (x == undefined || x == null) return false;
    if (x == "true") return true;
    if (x == "false") return false;
    if (!isNaN(Number(x))) return Number(x);
    return x;
}
rivets.formatters.disallow_alter = function (alter, id) {
    if (id == "" || id == undefined) return false;
    if (alter == "false" || alter == false) return true;
    return false;
}
rivets.formatters.eq = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x == y;
}
rivets.formatters.neq = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x != y;
}
rivets.formatters.geq = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x >= y;
}
rivets.formatters.leq = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x <= y;
}
rivets.formatters.eq_raw = function (x, y) {
    return x == y;
}
rivets.formatters.neq_raw = function (x, y) {
    return x != y;
}
rivets.formatters.contains = function (x, y) {
    if (x == undefined || y == undefined || typeof x != "string" || typeof y != "string") return false;
    return x.search(y) > -1;
}
rivets.formatters.ncontains = function (x, y) {
    if (x == undefined || y == undefined || typeof x != "string" || typeof y != "string") return false;
    return x.search(y) == -1;
}
rivets.formatters.contains_ = function (x, ...args) {
    for(let i=0; i<args.length; i++)
        if(x.search(args[i]) > -1)
            return true;
    return false;
}
rivets.formatters.ncontains_ = function (x, ...args) {
    for(let i=0; i<args.length; i++)
        if(x.search(args[i]) > -1)
            return false;
    return true;
}
rivets.formatters.and = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x && y;
}
rivets.formatters.or = function (x, y) {
    if (x == undefined || y == undefined) return false;
    return x || y;
}
rivets.formatters.or_ = function (x, y) {
    if (x == undefined || y == undefined) return false;
    if (x == "true" || x == true || x == 1) return true;
    if (y == "true" || y == true || y == 1) return true;
    return false;
}
rivets.formatters.and_str = function (x, y) {
    if (x == undefined || x == null || y == undefined || y == null) return false;
    if (x == "true" && y == "true") return true;
    return false;
}
rivets.formatters.is_true = function (x) {
    if (x == 'true' || x == true || x == 1)
        return true;
    return false;
}
rivets.formatters.is_false = function (x) {
    if (x == 'false' || x == false || x == 0)
        return true;
    return false;
}
rivets.formatters.len = function (arr) {
    if (!arr) return 0;
    return arr.length;
}
rivets.formatters.is_empty = function (arr) {
    if (!arr) return true;
    return arr.length > 0 ? false : true;
}
rivets.formatters.is_not_empty = function (arr) {
    if (!arr) return false;
    return arr.length > 0 ? true : false;
}
rivets.formatters.not = function (x) {
    return !x;
}
rivets.formatters.not_ = function (x) {
    return !x;
}
rivets.formatters.file_size = function (size) {
    if (!size) return "";
    if(size.toString().length <= 3)
        return size + " B";
    if(size.toString().length <= 6)
        return (size / 1024).toFixed(0) + " KB";
    if(size.toString().length <= 9)
        return (size / (1024 * 1024)).toFixed(1) + " MB";
    if(size.toString().length <= 12)
        return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    return "TOO BIG!";
}
rivets.formatters.file_name = function (name) {
    if (!name) return name;
    if(name.length < 30) return name;
    let end = name.substr(name.length - 8);
    let start = name.substr(0, 19);
    return start + "..." + end;
}
rivets.formatters.datetime = function (obj) {
    var date = new Date(obj).toLocaleDateString() + ' ' + new Date(obj).toLocaleTimeString();
    if (!date || date == "Invalid Date") return "";
    return date;
}
rivets.formatters.date = function (obj) {
    var date = new Date(obj);
    if (!date) return "";
    date = date.getFullYear() + "-" + min2(date.getMonth() + 1) + "-" + min2(date.getDate());
    return date;
}
rivets.formatters.utcdatetime = function (long) {
    var date = utclong_to_dt(long);
    if (!date) return "";
    return date;
}
rivets.formatters.keys = function (obj) {
    if (!obj) return [];
    return Object.keys(obj);
}
rivets.formatters.keys_arr = function (arr, prop) {
    if (!arr) return [];
    let res = [];
    arr.forEach(item => {
        res.push(item[prop]);
    });
    return res;
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
    if (str == undefined || str == "" || str == null) return "";
    return str;
}
rivets.formatters.is_null_or_empty = function (str) {
    if (str == undefined || str == null || typeof str != "string" || str == "") return true;
    return false;
}
rivets.formatters.is_null = function (x) {
    if (x == undefined || x == null) return true;
    return false;
}
rivets.formatters.isnt_null_or_empty = function (str) {
    if (str == undefined || typeof str != "string" || str == "") return false;
    return true;
}
rivets.formatters.prefix = function (a, b) {
    if (a == undefined || b == undefined) return "";
    return b + a;
}
rivets.formatters.concat_ = function (a, b) {
    if (a == undefined || b == undefined) return "";
    return a.toString() + b.toString();
}
rivets.formatters.concat_before = function (a, b) {
    if (a == undefined || b == undefined) return "";
    return b.toString() + a.toString();
}
rivets.formatters.at = function (arr, i, prop) {
    if (arr == undefined || i == undefined) return "";
    var res = arr[i];
    if (prop) return res[prop];
    return res;
}
rivets.formatters.val = function (data, key) {
    if (typeof (data) != "object") {
        this.value = data;
        return "";
    }
    if (!data)
        return "";
    if (data[key] != undefined && data[key] != null)
        return data[key];
    return "";
}
rivets.formatters.lang_val = function (data, key) {
    if (data == null || typeof (data) != "object") {
        return key;
    }
    if (data[key] == undefined)
        return key;
    return data[key];
}

rivets.formatters.val2 = function (data, key, key2) {
    if (typeof (data) != "object") {
        this.value = data;
        return "";
    }
    if (data[key] && data[key][key2])
        return data[key][key2];
    return "";
}
rivets.formatters.val3 = function (data, key, key2, key3) {
    if (data && data[key] && data[key][key2] && data[key][key2][key3])
        return data[key][key2][key3];
    return "";
}
rivets.formatters.val4 = function (data, key, key2, key3, key4) {
    if (data && data[key] && data[key][key2] && data[key][key2][key3] && data[key][key2][key4])
        return data[key][key2][key3][key4];
    return "";
}
rivets.formatters.val_dt = function (data, key) {
    if (data && data[key]) {
        return rivets.formatters.datetime(data[key]);
    }
    return "";
}
rivets.formatters.val_date = function (data, key) {
    if (data && data[key]) {
        return rivets.formatters.date(data[key]);
    }
    return "";
}
rivets.formatters.val_num = function (data, key) {
    if (data[key]) {
        var val = data[key].toString();
        val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return val;
    }
    return 0;
}
rivets.formatters.id_rnd = function () {
    return '_' + parseInt(Math.random() * 1000000000);
}
rivets.formatters.val_props = function (data, key) {
    // if (data[key] && data[key].props)
    //     console.log(data[key].props);
    if (data[key] && data[key].props)
        return data[key].props;
    return [];
}
rivets.formatters.val_obj_keys = function (data, key) {
    console.log(key);
    if (!data[key])
        return [];
    if (typeof data[key] != Object)
        return [];
    var d = Object.keys(data[key]);
    return d;
}
rivets.formatters.val_obj = function (obj, key1, key2, key3) {
    if (obj[key1] && obj[key1][key2] && obj[key1][key2][key3])
        return obj[key1][key2][key3];
    else if (obj[key1] && data[key1][key2])
        return obj[key1][key2];
    else if (obj[key1])
        return obj[key1];
    return {};
}
rivets.formatters.true_and_eq = function (param1, param2, param3) {
    if (!rivets.formatters.is_true(param1))
        return false;
    return param2 == param3;
}
rivets.formatters.val_by_key = function (value, arr, key_search, key_return) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key_search] == value)
            return arr[i][key_return];
    }
    return "";
}
rivets.formatters.val_dic = function (data, fkey, prop_data) {
    if (!data[fkey])
        return "";
    return data[fkey][prop_data];

}
rivets.formatters.val_has = function (data, key, val) {
    if (!data[key])
        return false;
    for (var i = 0; i < data[key].length; i++)
        if (data[key][i] == val)
            return true;
    return false;
}
rivets.formatters.val_has_checked = function (data, key, val) {
    if (!data[key])
        return false;
    for (var i = 0; i < data[key].length; i++)
        if (data[key][i] == val)
            return "checked";
    return false;
}
rivets.formatters.prop_d = function (chat, d) {
    if (!chat || (!chat.draft || Object.keys(chat.draft).length == 0))
        return "";
    for (var i = 0; i < chat.props_filter.length; i++)
        if (chat.props_filter[i].filter_d == d)
            return chat.draft[chat.props_filter[i].key];
    return "";
}
rivets.formatters.keys = function (obj) {
    if (!obj)
        return [];
    return Object.keys(obj);
}
rivets.formatters.keys_val = function (data, key) {
    var val = rivets.formatters.val(data, key);
    if (!val)
        return [];
    return Object.keys(val);
}
rivets.formatters.keys_val_i0 = function (data, key) {
    var val = rivets.formatters.val(data, key);
    if (!val || val.length == 0)
        return [];
    return Object.keys(val[0]);
}
rivets.formatters.contains_arr_prop = function (arr, prop, val) {
    if (!arr || !arr[prop]) return false;
    return arr[prop].indexOf(val) != -1;
}
rivets.formatters.show_chat = function (chat) {
    return chat.has_menu == 'true' || chat.wrap == 'wrapper';
}
rivets.formatters.concat = function (a, b) {
    if (a == undefined) return b;
    if (b == undefined) return a;
    if (typeof a != "string") return b;
    if (typeof b != "string") return a;
    return a + " " + b;
}
rivets.formatters.filter_prop = function (arr, prop, val) {
    var res = [];
    if (!arr || !prop || !val) return arr;
    arr.forEach(item => {
        if (item[prop] == val)
            res.push(item);
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
rivets.formatters.substr = function (str, s, l = null) {
    if (!str)
        return "";
    return str.substr(s, l);
}
rivets.formatters.substr_ = function (str, s, l = null) {
    if (!str)
        return "";
    return str.substr(s, l).toUpperCase();
}
rivets.formatters.sep3 = function (str) {
    let char_grouping = ',';
    let char_decimal = '.';
    if (str == undefined || str == null) return "";
    try {
        str = str.toString();
    } catch (x) {
        return "";
    }
    var is_negative = false;
    if (str[0] == "-") is_negative = true;
    str = (dirty_num_to_num(str)).toString();
    let last = str.indexOf('.');
    if (last == -1) last = str.length;
    let str_end = str.substr(last + 1, str.length);
    if (str_end != "") str_end = char_decimal + str_end.substr(0, 2);
    str = str.substr(0, last);
    var set_i = str.length % 3;
    var res = "";
    for (var i = 0; i < str.length; i++) {
        if (i != 0 && i % 3 == set_i) {
            res += char_grouping;
        }
        res += str[i];
    }
    if (is_negative) res = "-" + res + str_end;
    return res + str_end;
}
rivets.formatters.sep4 = function (str) {
    if (str == undefined) return "";
    try {
        str = str.toString();
    } catch (x) {
        return "";
    }
    str = (dirty_num_to_num(str)).toString();
    var res = "";
    for (var i = 0; i < str.length; i++) {
        if (i != 0 && i % 4 == 0) res += " ";
        res += str[i];
    }
    return res;
}
rivets.formatters.show_props = function (props) {
    if (!props || typeof props != "object" || !props.length) return false;
    for (let i = 0; i < props.length; i++) {
        if (props[i].filter == "true" && props[i].v == "true") return true;
    }
    return false;
}
rivets.formatters.show_props_filters = function (props, key) {
    if (!props || typeof props != "object" || !props.length) return false;
    for (let i = 0; i < props.length; i++) {
        if (props[i].filter == "true" && props[i].v == "true" && props[i].type != 'toggle' && props[i].type != 'radio')
            return true;
    }
    if (scope[key].filter_date == "true")
        return true;
    return false;
}
rivets.formatters.has_img = function (src, show) {
    if (!src || src == "" || src == "1" || src == "data" || src.length < 5)
        return show == "false" ? true : false;
    return show == "true" ? true : false;
}
rivets.formatters.has_actions = function (actions, position) {
    if (!actions || actions.length == 0) return false;
    for (let i = 0; i < actions.length; i++) {
        if (position != undefined) {
            if (actions[i] && actions[i].position == position)
                return true;
        } else {
            return true;
        }
    }
    return false;
}
rivets.formatters.is_hidden = function (prop, id) {
    if (id == "" && prop.draft == "true") return false;
    if (prop.v == "false" || (id == "" && prop.draft == "false") || prop.form == "false") {
        return true;
    }
    return false;
}
rivets.formatters.show_submit = function (alter, add, id) {
    if (add == "true" && (id == undefined || id == "")) {
        return true;
    }
    if (alter == "true" && (id != "")) {
        return true;
    }
    return false;
}
rivets.formatters.show_submit_end = function (actions, position, id) {
    if (id == undefined || id == "") //new
        return false;
    return rivets.formatters.has_actions(actions, position);
}

rivets.formatters.date_now = function () {
    return new Date().toISOString().split("T")[0];
}
rivets.formatters.set_value_ = function (val, key, prop1, prop2, prop3, prop4, prop5) {
    if (prop5 && prop5 != '') {
        scope[key][prop1][prop2][prop3][prop4][prop5] = val;
        return;
    }
    if (prop4 && prop4 != '') {
        scope[key][prop1][prop2][prop3][prop4] = val;
        return;
    }
    if (prop3 && prop3 != '') {
        scope[key][prop1][prop2][prop3] = val;
        return;
    }
    if (prop2 && prop2 != '') {
        scope[key][prop1][prop2] = val;
        return;
    }
    if (prop1 && prop1 != '') {
        scope[key][prop1] = val;
        return;
    }
    if (key && key != '') {
        scope[key] = val;
    }
}
rivets.formatters.sum = function (arr, prop) {
    if (!arr || !prop) return 0;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        if (!isNaN(Number(arr[i][prop])))
            sum += arr[i][prop];
    }
    return sum.toFixed(2);
}
rivets.formatters.is_not_last = function (arr, i) {
    if (!arr) return false;
    return arr.length - 1 != i;
}

rivets.formatters.paginate_after_need = paginate_after_need;
rivets.formatters.paginate_before_need = paginate_before_need;
//#endregion