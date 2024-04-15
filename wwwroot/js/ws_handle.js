async function ws_message(msg_ws) {
    let message = JSON.parse(msg_ws.data);
    if(scope.chat.id == message.chat_id)
        scope.chat = await ev.chat_get_or_add(message.chat_id, undefined, 1);
    else
        await ev.chat_get_list();
}