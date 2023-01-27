import fs = require('fs');

export function readJsonFromFile(filename: string, callback: (data: any[]) => void) {
    fs.readFile(filename, (err, data) => {
        if (err) throw err;
        callback(JSON.parse(data.toString()))
    });
}

export function writeJsonToFile(filename: string, data: any[]) {
    var jsonData = JSON.stringify(data);
    fs.writeFile(filename, jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}