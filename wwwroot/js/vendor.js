
//#region vendor offers
/**
 * Calculates offer items prices on inputs changes.
 * 
 * @param {object} scope.vendor_offer from global var.
 *
 * @return {void} Changes scope.vendor_offer properties.
 */
ev.vendor_offer_price_calc = function () {
    // scope.vendor_offer.item.price_unit = Number(scope.vendor_offer.item.price_unit);
    if (scope.vendor_offer.item.price_unit.length > 0 && scope.vendor_offer.item.price_unit[0] == '0')
        scope.vendor_offer.item.price_unit = scope.vendor_offer.item.price_unit.substr(1);
    if (isNaN(scope.vendor_offer.item.price_unit)) scope.vendor_offer.item.price_unit = 0;

    // scope.vendor_offer.item.amount_offered = Number(scope.vendor_offer.item.amount_offered);
    if (scope.vendor_offer.item.amount_offered.length > 0 && scope.vendor_offer.item.amount_offered[0] == '0')
        scope.vendor_offer.item.amount_offered = scope.vendor_offer.item.amount_offered.substr(1);
    if (isNaN(scope.vendor_offer.item.amount_offered)) scope.vendor_offer.item.amount_offered = 0;

    // scope.vendor_offer.item.vat = Number(scope.vendor_offer.item.vat);
    if (scope.vendor_offer.item.vat.length > 0 && scope.vendor_offer.item.vat[0] == '0')
        scope.vendor_offer.item.vat = scope.vendor_offer.item.vat.substr(1);
    if (scope.vendor_offer.item.vat > 100) scope.vendor_offer.item.vat = 100;
    if (scope.vendor_offer.item.vat < 0) scope.vendor_offer.item.vat = 0;
    if (isNaN(scope.vendor_offer.item.vat)) scope.vendor_offer.item.vat = 0;

    // price_delivery
    if (scope.vendor_offer.item.price_delivery.length > 0 && scope.vendor_offer.item.price_delivery[0] == '0')
        scope.vendor_offer.item.price_delivery = scope.vendor_offer.item.price_delivery.substr(1);
    if (isNaN(scope.vendor_offer.item.price_delivery)) scope.vendor_offer.item.price_delivery = 0;

    scope.vendor_offer.item.price_subtotal = (scope.vendor_offer.item.price_unit * scope.vendor_offer.item.amount_offered).toFixed(2);
    if (scope.vendor_offer.item.vat == 0)
        scope.vendor_offer.item.price_vat = 0;
    else {}
    scope.vendor_offer.item.price_vat = ((scope.vendor_offer.item.price_subtotal) * (scope.vendor_offer.item.vat / 100)).toFixed(2);

    scope.vendor_offer.item.price_total = (Number(scope.vendor_offer.item.price_subtotal) + Number(scope.vendor_offer.item.price_vat) + Number(scope.vendor_offer.item.price_delivery)).toFixed(2);
}

/**
 * Gets module server URL for fetches.
 * 
 * @return {void} Assigns scope.vendor_offer.server.
 */
ev.vendor_offer_get_url = async function () {
    var url = new URL(window.location);
    var ms = url.searchParams.get("ms");
    if(ms == null){
        scope.vendor_offer.section = "expired";
        return;
    }
    const res = await fetch(scope.url.server + "ms_/?ms=" + ms);
    const d = await res.text();
    scope.vendor_offer.server = d;
}

/**
 * Gets vendor offer.
 * 
 * @return {Promise<void>} Assigns scope.vendor_offer.data_.
 */
ev.vendor_offer_get = async function () {
    var url = new URL(window.location);
    var guid = url.searchParams.get("key");
    if(guid == null){
        scope.vendor_offer.section = "expired";
        return;
    }
    const res = await fetch(scope.vendor_offer.server + "92ab364e8f439e2dbc957709b3a70c711a63878c41c08c2c9e03ba940dd4b840/" + guid + "/?iso=" + scope.lang.iso);
    const d = await res.text();
    try {
        scope.vendor_offer.data_ = JSON.parse(d);
    } catch (ex) {
        scope.vendor_offer.section = "expired";
        return;
    }
    scope.vendor_offer.item = scope.vendor_offer.data_.offer_items[0];
    let section_change = this.dataset && this.dataset.section_change == "true";
    if(section_change){
        ev.vendor_offer_change_sec("main", 0);
    }
}

/**
 * Changes vendo offer page section.
 * 
 * Either shows detail form or the main section
 * 
 * If the first parameter be an object then retrives parameters from the element dataset. 
 * @param {boolean} section If true then shows the item detail form, else shows the main section.
 * @param {Number} i index of the item to show in details.
 *
 * @return {void} assigns scope.vendor_offer.section.
 */
ev.vendor_offer_change_sec = function (section, i) {
    if (typeof section == "object") {
        section = scope.vendor_offer.section = this.dataset.section;
        i = parseInt(this.dataset.i);
    } 
    else {
        scope.vendor_offer.section = section;
    }
    if (section == "detail") {
        scope.vendor_offer.item = scope.vendor_offer.data_.offer_items[i];
        // scope.vendor_offer.item = ev.vendor_offer_item_set_default(scope.vendor_offer.item);
        if (!scope.vendor_offer.item.currency)
            scope.vendor_offer.item.currency = scope.vendor_offer.data_.currencies[0].value;
        ev.vendor_offer_price_calc();
    } 
    else if(section == "main"){
        for (let i = 0; i < scope.vendor_offer.data_.offer_items.length; i++) {
            if (scope.vendor_offer.data_.offer_items[i].key == "new") {
                scope.vendor_offer.data_.offer_items.splice(i, 1);
                break;
            }
        }
    }
}

/**
 * Sends offer items data to the server.
 * 
 * @param {boolean} check_terms If true then checks whether the contract is accepted or not.
 * @param {boolean} section If true then sends the quote to the company.
 *
 * @return {Promise<void>}
 */
ev.vendor_offer_set = async function (check_terms, section) {
    if(scope.vendor_offer.data_.d == "" && check_terms != false)
        check_terms = true;
    if (scope.vendor_offer.data_.allow_alter == "true" && check_terms == true && !scope.vendor_offer.data_.contract_accepted) {
        scope.vendor_offer.terms_err = true;
        scope.vendor_offer.terms_err_txt = "Please read and accept terms and conditions!";
        return;
    }
    if(section != false){
        section = true;
    }
    scope.vendor_offer.data_.confirmed = section;
    // scope.vendor_offer.data_.attachments = JSON.stringify(scope.vendor_offer.data_.attachments);
    var d = JSON.stringify(scope.vendor_offer.data_);
    var res = await fetch(scope.vendor_offer.server + "cb400cb949fde4c466abfc06199cfe87114ff0a7861df32f2bac13f360d0a905/", {
        method: "POST",
        body: d
    });
    res = await res.text();
    res = JSON.parse(res);
    console.log(res);
    if(check_terms){
        ev.vendor_offer_change_sec("finished");
        scope.vendor_offer.data_.form_message_txt = res.str;
    } else {
        if(res.code == 200 && res.success == true){
            toast(res.str, 1);
        } else {
            toast(res.str, -1);
        }
        await ev.vendor_offer_get();
    }
}

/**
 * Sends offer items data to the server and gets them again.
 * 
 * @param {boolean} check_terms If true then checks whether the contract is accepted or not.
 *
 * @return {void}
 */
ev.vendor_offer_set_item = async function () {
    let i = parseInt(this.dataset.i);
    scope.vendor_offer.data_.offer_items[i] = scope.vendor_offer.item;
    await ev.vendor_offer_set(false, false);
    ev.vendor_offer_change_sec("main", i);
}

/**
 * Pushes new item draft to the offer items. Changes section after push.
 * 
 * @param {Number} i, from dataset; index of item to insert after.
 *
 * @return {void}
 */
ev.vendor_offer_item_add = async function () {
    let i = parseInt(this.dataset.i);
    let item_new = JSON.parse(JSON.stringify(scope.vendor_offer.data_.offer_items[i]));
    item_new = ev.vendor_offer_item_set_default(item_new);
    item_new.key_ref = item_new.key;
    item_new.key = "new";
    scope.vendor_offer.data_.offer_items.splice(i, 0, item_new);
    ev.vendor_offer_change_sec("detail", i);
}

/**
 * sets item property with default value
 * 
 * @param {object} item, vendor offer item.
 *
 * @return {object} item
 */
ev.vendor_offer_item_set_default = function (item) {
    // 
    item.price_unit = "";
    item.amount_offered = "";
    item.price_delivery = "";
    // item.date_delivery = "";
    item.vat = "";
    item.p = "";
    // item.amount_demand_ = 
    return item;
}
//#endregion