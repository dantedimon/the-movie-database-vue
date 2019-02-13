let express = require('express');
let serveStatic = require('serve-static');
let path = require('path');
let port = process.env.PORT || 5000;

let app = express();

app.use(serveStatic(__dirname + "/dist"));

app.listen(port);