var path = require('path');
var express = require('express');
var app = module.exports = express();

// serve demo
app.use(express.static(path.join(__dirname, 'demo')));

app.use('/dist', express.static(path.join(__dirname, 'dist')));
