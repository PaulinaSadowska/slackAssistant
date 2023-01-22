import { fetchConversations } from "../fetchConversations";
import channel from "./channel";
import fs = require('fs');

fetchConversations({
    channelId: channel.id,
    latest: new Date(2023, 0, 23),
    oldest: new Date(2023, 0, 0)
}).then((result) => {
    var jsonData = JSON.stringify(result);

    fs.writeFile("output/history.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
})
