import fs = require('fs');

export function readJsonFromFile(filename: string): any[] {
    const data = fs.readFileSync(filename)
    return JSON.parse(data.toString())
}

export function writeJsonToFile(filename: string, data: any[]) {
    var jsonData = JSON.stringify(data);
    fs.writeFile(filename, jsonData, function (err) {
        if (err) {
            console.log(err);
        }
    });
}