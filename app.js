'use strict';

var path = require('path');
var express = require('express');
var app = module.exports = express();

// serve demo
app.use(express.static(path.join(__dirname, 'demo')));

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use('/docs', express.static(path.join(__dirname, 'docs')));

// serve index.html for all remaining routes, in order to leave routing up to angular
app.all("/*", function(req, res, next) {
	res.sendfile("index.html", { root: __dirname + "/demo" });
});
