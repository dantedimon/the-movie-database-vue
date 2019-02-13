let express = require('express');
let serveStatic = require('serve-static');
let path = require('path');
let port = process.env.PORT || 80;

let app = express();

app.use(serveStatic(__dirname + "/dist"));

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname + "/dist", 'index.html'));
});

app.listen(port);