const express = require('express');
const path = require('path');

const app = express();
let port = process.env.PORT || 80;

app.use('/', express.static('dist'));

app.listen(port);