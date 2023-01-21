import { fetchConversations } from "../fetchConversations";
import channel from "./channel";
import fs = require('fs');

fetchConversations({
    channelId: channel.id,
}).then((result) => {
    var jsonData = JSON.stringify(result);

    fs.writeFile("output/history.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
})
