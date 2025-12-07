var socket;
var tries = 0;
function socket_init() {
    socket = new WebSocket(scope.url.ws);
    socket.onopen = socket_onopen;
    socket.onmessage = socket_onmessage;
    socket.onclose = socket_onclose;
    socket.onerror = socket_onerror;
}

socket_authentication = function () {
    var d = {
        action: "auth",
    };
    socket.send(params_to_socket(d));
}

socket_onopen = function (e) {
    console.log("[open] Connection established");
    socket_authentication();
    tries = 0;
};

socket_onmessage = async function (event) {
    // console.log(`[message] Data received from server: ${event.data}`);
    var msg = JSON.parse(event.data);
    var msg_ws = JSON.parse(msg.data);
    console.log(msg_ws);
    switch (msg_ws.action) {
        case "auth": {
            if (msg_ws.success)
                console.log("Authed");
            else
                socket.close();
            return;
        }
        case "message": {
            ws_message(msg_ws);
            break;
        }
    }
};

socket_onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        tries = 0;
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
        tries++;
        if (tries > 3)
            return;
        socket_init();
    }
};

socket_onerror = function (error) {
    console.log(error);
};