var express = require('express');
var app = express();
import {exec, cd} from "shelljs";

app.get('/', function (req, res) {
    exec('java -version', code => {
        console.log('Exit code:', code);
        res.send('Hello World!' + code);
    });

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
