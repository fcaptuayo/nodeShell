var express = require('express');
var app = express();
import {exec, cd} from "shelljs";

app.get('/', function (req, res) {

    return new Promise((resolve, reject) => {
        exec('java -version', code => {
            console.log('Exit code:', code);
            resolve(code);
        });
    });

    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
