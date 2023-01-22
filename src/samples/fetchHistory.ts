import { fetchConversations } from "../fetchConversations";

import fs = require('fs');
import config from "../config";

fetchConversations({
    channelId: config.channel.id,
    withReplies: true,
    latest: new Date(2023, 0, 23),
    oldest: new Date(2023, 0, 0)
}).then((result) => {
    var jsonData = JSON.stringify(result);

    fs.writeFile(config.filenames.history, jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
})


fetchConversations({
    channelId: config.channel.id,
    withReplies: false,
    latest: new Date(2023, 0, 23),
    oldest: new Date(2023, 0, 0)
}).then((result) => {
    var jsonData = JSON.stringify(result);

    fs.writeFile(config.filenames.historyWithoutReplies, jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
})
