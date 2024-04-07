var scope = {};
var ev = {};
/////////////////////
scope.url = {};
// scope.url.server = "http://10.10.10.2:8080/";
// scope.url.server = "http://192.168.1.6:8080/";
// scope.url.server = "http://4dce54df9f4c.ngrok.io/";
// scope.url.server = "https://tehranmusicnights.com/";
// scope.url.server = "http://127.0.0.1:5000/";
scope.url.server = "https://jamming.ir/";

scope.self = {};
scope.sep = ";";

////////////////////dashboard
scope.date_from = {};
scope.date_to = {};
scope.search = {};
scope.search_ready = false;
scope.search_timeout = null;
scope.skip = 0;
scope.preference_clients = {};
scope.preference_clients.take = 20;

scope.timediff = 12600000; //in ms

scope.dashboard = {};
ev.dashboard = {};

scope.charts = {};
scope.charts.is_set = false;

scope.login = {};
// scope.charts.push({
//     data: [15, 30],
//     bgs: ['rgb(255, 99, 132)', 'rgb(132, 99, 255)']
// });


////////////////////desktop
scope.desktop = {};
ev.desktop = {};
scope.desktop.data = [];
scope.desktop.data_ = {};

////////////////////todos
scope.todos = {};
ev.todos = {};
scope.todos.data = [];
scope.todos.data_ = {};

////////////////////notifications
scope.notifications = {};
ev.notifications = {};
scope.notifications.data = [];
scope.notifications.data_ = {};

//////////////////////////////////////////dtos

///////////////////// consts
scope.consts = {};
ev.consts = {};
scope.consts.data_ = {};
scope.consts.form_header;
scope.consts.form_id = "#form_const";
scope.consts.form_header_edit = "Edit Consts";
scope.consts.form_header_add = "Add Consts";
///////////////////// users
scope.users = {};
ev.users = {};
scope.users.data = [];
scope.users.data_ = {};
scope.users.errors = [];
scope.users.rows_total = 0;
scope.users.page_count = 0;
scope.users.pages = [];
scope.users.page = 1;
scope.users.form_header;
scope.users.form_id = "#form_user";
scope.users.form_header_edit = "Edit User";
scope.users.form_header_add = "Add User";

///////////////////// attachments
scope.attachments = {};
ev.attachments = {};
scope.attachments.data = [];
scope.attachments.data_ = {};
scope.attachments.errors = [];
scope.attachments.rows_total = 0;
scope.attachments.page_count = 0;
scope.attachments.pages = [];
scope.attachments.page = 1;
scope.attachments.form_header;
scope.attachments.form_id = "#form_attachment";
scope.attachments.form_header_edit = "Edit Attachment";
scope.attachments.form_header_add = "Add Attachment";
scope.attachments.selected = [];
scope.attachments.loc_last = "";
scope.attachments.key_last = "";

///////////////////// categories
scope.categories = {};
ev.categories = {};
scope.categories.data = [];
scope.categories.data_ = {};
scope.categories.rows_total = 0;
scope.categories.page_count = 0;
scope.categories.pages = [];
scope.categories.page = 1;
scope.categories.form_header;
scope.categories.form_id = "#form_category";
scope.categories.form_header_edit = "Edit Category";
scope.categories.form_header_add = "Add Category";

///////////////////// contents
scope.contents = {};
ev.contents = {};
scope.contents.data = [];
scope.contents.data_ = {};
scope.contents.errors = [];
scope.contents.rows_total = 0;
scope.contents.page_count = 0;
scope.contents.pages = [];
scope.contents.page = 1;
scope.contents.form_header;
scope.contents.form_id = "#form_content";
scope.contents.form_header_edit = "Edit Content";
scope.contents.form_header_add = "Add Content";

///////////////////// _events
scope._events = {};
ev._events = {};
scope._events.tab = "base";
scope._events.data = [];
scope._events.data_ = {};
scope._events.errors = [];
scope._events.rows_total = 0;
scope._events.page_count = 0;
scope._events.pages = [];
scope._events.page = 1;
scope._events.form_header;
scope._events.form_id = "#form_event";
scope._events.form_header_edit = "Edit Event";
scope._events.form_header_add = "Add Event";

///////////////////// comments
scope.comments = {};
ev.comments = {};
scope.comments.tab = "base";
scope.comments.data = [];
scope.comments.data_ = {};
scope.comments.errors = [];
scope.comments.rows_total = 0;
scope.comments.page_count = 0;
scope.comments.pages = [];
scope.comments.page = 1;
scope.comments.form_header;
scope.comments.form_id = "#form_comment";
scope.comments.form_header_edit = "Edit Comment";
scope.comments.form_header_add = "Add Comment";

///////////////////// comments_
scope.comments_ = {};
ev.comments_ = {};
scope.comments_.data = [];
scope.comments_.data_ = {};
scope.comments_.errors = [];
scope.comments_.rows_total = 0;
scope.comments_.page_count = 0;
scope.comments_.pages = [];
scope.comments_.page = 1;
scope.comments_.form_header;
scope.comments_.form_id = "#form_comment";
scope.comments_.form_header_edit = "Edit Comment";
scope.comments_.form_header_add = "Add Comment";

///////////////////// likes
scope.likes = {};
ev.likes = {};
scope.likes.tab = "base";
scope.likes.data = [];
scope.likes.data_ = {};
scope.likes.errors = [];
scope.likes.rows_total = 0;
scope.likes.page_count = 0;
scope.likes.pages = [];
scope.likes.page = 1;
scope.likes.form_header;
scope.likes.form_id = "#form_like";
scope.likes.form_header_edit = "Edit Like";
scope.likes.form_header_add = "Add Like";

///////////////////// reserves
scope.reserves = {};
ev.reserves = {};
scope.reserves.data = [];
scope.reserves.data_ = {};
scope.reserves.errors = [];
scope.reserves.rows_total = 0;
scope.reserves.page_count = 0;
scope.reserves.pages = [];
scope.reserves.page = 1;
scope.reserves.form_header;
scope.reserves.form_id = "#form_reserve";
scope.reserves.form_header_edit = "Edit Reserve";
scope.reserves.form_header_add = "Add Reserve";
scope.reserves.tab = "base";

///////////////////// members
scope.members = {};
ev.members = {};
scope.members.data = [];
scope.members.data_ = {};
scope.members.errors = [];
scope.members.rows_total = 0;
scope.members.page_count = 0;
scope.members.pages = [];
scope.members.page = 1;
scope.members.form_header;
scope.members.form_id = "#form_member";
scope.members.form_header_edit = "Edit Member";
scope.members.form_header_add = "Add Member";
scope.members.tab = "base";

///////////////////// member_codes
scope.member_codes = {};
ev.member_codes = {};
scope.member_codes.data = [];
scope.member_codes.data_ = {};
scope.member_codes.errors = [];
scope.member_codes.rows_total = 0;
scope.member_codes.page_count = 0;
scope.member_codes.pages = [];
scope.member_codes.page = 1;
scope.member_codes.form_header;
scope.member_codes.form_id = "#form_member_code";
scope.member_codes.form_header_edit = "Edit Member";
scope.member_codes.form_header_add = "Add Member";

///////////////////// memberships
scope.memberships = {};
ev.memberships = {};
scope.memberships.data = [];
scope.memberships.data_ = {};
scope.memberships.errors = [];
scope.memberships.rows_total = 0;
scope.memberships.page_count = 0;
scope.memberships.pages = [];
scope.memberships.page = 1;
scope.memberships.form_header;
scope.memberships.form_id = "#form_membership";
scope.memberships.form_header_edit = "Edit Membership";
scope.memberships.form_header_add = "Add Membership";

///////////////////// entrances
scope.entrances = {};
ev.entrances = {};
scope.entrances.data = [];
scope.entrances.data_ = {};
scope.entrances.errors = [];
scope.entrances.rows_total = 0;
scope.entrances.page_count = 0;
scope.entrances.pages = [];
scope.entrances.page = 1;
scope.entrances.form_header;
scope.entrances.form_id = "#form_entrance";
scope.entrances.form_header_edit = "Edit Entrance";
scope.entrances.form_header_add = "Add Entrance";

///////////////////// transactions
scope.transactions = {};
ev.transactions = {};
scope.transactions.data = [];
scope.transactions.data_ = {};
scope.transactions.errors = [];
scope.transactions.rows_total = 0;
scope.transactions.page_count = 0;
scope.transactions.pages = [];
scope.transactions.page = 1;
scope.transactions.form_header;
scope.transactions.form_id = "#form_transaction";
scope.transactions.form_header_edit = "Edit Transaction";
scope.transactions.form_header_add = "Add Transaction";

///////////////////// locations
scope.locations = {};
ev.locations = {};
scope.locations.data = [];
scope.locations.data_ = {};
scope.locations.errors = [];
scope.locations.rows_total = 0;

///////////////////// preferences
scope.preferences = {};
ev.preferences = {};
scope.preferences.data = [];
scope.preferences.data_ = {};
scope.preferences.errors = [];
scope.preferences.rows_total = 0;
scope.preferences.page_count = 0;
scope.preferences.pages = [];
scope.preferences.page = 1;
scope.preferences.att_view = 1;
scope.preferences.att_modal = false;
scope.preferences.form_header;
scope.preferences.form_id = "#form_preference";
scope.preferences.form_header_edit = "Edit Preferences";
scope.preferences.form_header_add = "Add Preferences";

///////////////////// x-logs
scope.sys_logs = {};
ev.sys_logs = {};
scope.sys_logs.data = [];
scope.sys_logs.data_ = {};
scope.sys_logs.errors = [];
scope.sys_logs.rows_total = 0;
scope.sys_logs.page_count = 0;
scope.sys_logs.pages = [];
scope.sys_logs.page = 1;
scope.sys_logs.form_header;
scope.sys_logs.form_id = "#form_sys_log";

///////////////enums
scope.enum_users_flag = [{
    id: 0,
    value: "ok",
    name: "Ok"
}, {
    id: 1,
    value: "block",
    name: "Block"
}, ];

scope.enum_content_states = [{
    id: 0,
    value: "trash",
    name: "Trash"
}, {
    id: 1,
    value: "draft",
    name: "Draft"
}, {
    id: 2,
    value: "published",
    name: "Published"
}];

scope.enum_comment_states = [{
    id: 0,
    value: "added",
    name: "Added"
}, {
    id: 1,
    value: "accepted",
    name: "Accepteded"
}, {
    id: 2,
    value: "rejected",
    name: "Rejected"
}];

scope.enum_accounts_flag = [{
    id: 0,
    value: "ok",
    name: "Ok"
}, {
    id: 1,
    value: "block",
    name: "Block"
}, {
    id: 2,
    value: "deleted",
    name: "Deleted"
}];

scope.enum_transaction_flag = [{
    id: 1,
    value: "reserve",
    name: "Reserve"
}, {
    id: 2,
    value: "credit_enc",
    name: "Encrease Credit"
}, {
    id: 3,
    value: "credit_dec",
    name: "Decrease Credit"
}, {
    id: 4,
    value: "entrance_guest",
    name: "Guest Enter"
}, {
    id: 5,
    value: "membership_pay",
    name: "Membership Pay"
}, {
    id: 6,
    value: "event_enc",
    name: "Encrease Reserve"
}, {
    id: 7,
    value: "event_dec",
    name: "Decrease Reserve"
}];

scope.enum_transaction_states = [{
    id: 1,
    value: "inited",
    name: "Inited"
}, {
    id: 2,
    value: "paying",
    name: "Paying"
}, {
    id: 3,
    value: "payed",
    name: "Payed"
}, {
    id: 4,
    value: "verified",
    name: "Verified"
}, {
    id: 5,
    value: "failed",
    name: "Failed"
}];

scope.enum_attachments_flag = [{
    id: 0,
    value: "added",
    name: "Added"
}, {
    id: 1,
    value: "verified",
    name: "Verified"
}, {
    id: 2,
    value: "denied",
    name: "Denied"
}];

scope.enum_members_flag = [{
        id: 0,
        value: "added",
        name: "Added"
    },
    {
        id: 1,
        value: "verified",
        name: "Verified"
    },
    {
        id: 2,
        value: "blocked",
        name: "Blocked"
    },
];

scope.enum_entrance_flag = [{
    id: 1,
    value: "guest",
    name: "Guest"
},
{
    id: 2,
    value: "membership",
    name: "Membership"
},
{
    id: 3,
    value: "membership_pay",
    name: "Membership Pay"
},
{
    id: 4,
    value: "event",
    name: "Event"
},
{
    id: 5,
    value: "event_all",
    name: "All Event"
},
];

scope.enum_gateways = [{
    id: 1,
    value: "payir",
    name: "Pay.ir"
}, {
    id: 2,
    value: "wallet",
    name: "Wallet"
}, {
    id: 3,
    value: "user",
    name: "Admin"
}, {
    id: 4,
    value: "zp",
    name: "Zarrin Pal"
}, {
    id: 5,
    value: "mp",
    name: "Aqaye Pardakht"
}];

scope.colors = [
    "#922b21", "#943126", "#6c3483", "#1f618d", "#2874a6", "#148f77", "#117a65", "#1e8449", "#239b56", "#b7950b", "#b9770e", "#af601a", "#a04000", "#b3b6b7", "#909497", "#717d7e", "#283747", "#212f3d"
];

rivets.binders['style-*'] = function (el, value) {
    el.style.setProperty(this.args[0], value);
};