var scope = {};
var ev = {};
var sections = [];
ev.dashboard = {};
ev.notifications = {};
ev.todos = {};

scope.page = 1;
scope.pages = [];
scope.page_count = [];
scope.rows_total = 0;
scope.sort_asc = 0;
scope.sort_key = "id";

/////////////////////
scope.url = {};
scope.url.server = "";
scope.sep = ";";
scope.pref = {};
scope.self = {};
scope.self.time_zone = "Europe/Istanbul";
scope.self.time_format = "en-TR";
scope.self.theme = "light";
scope.key_const = "JpTkdJeEMlVEYzJZ";

////////////////////dashboard
scope.date_from = {};
scope.date_to = {};
scope.search = {};
scope.search_ready = false;
scope.search_timeout = null;
scope.skip = 0;

ev.self_ = {};
scope.charts = {};
scope.login = {};
scope.login_section = 1;
scope.register = {};
scope.login.form_error_txt = "error";
scope.packages = [];

scope.payment_src = false;
scope.logo = "assets/images/logo.png";
scope.forgot = {};

scope.dic = {};
var section_current = "";
var img_def;
var toast_timeout;
var toast_top = 7;
var toast_top_default = 7;
var toast_right_default = -40;
var toast_right_true = 42;
var uploading = false;
var worker = null;

scope.vendor_offer = {};
ev.vendor_offer = {};
scope.temp = {};
scope.is_sending = false;
scope.last_action = "";
scope.last_key = "";
scope.year = new Date().getFullYear();
scope.modal_id = "modal_user_info";

scope.contact = {};
scope.chat = {};
scope.message = {};
scope.message.txt = "";