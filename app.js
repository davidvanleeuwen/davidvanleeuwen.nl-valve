/**
 * Module dependencies:
 * - ExpressJS (and all submodules)
 * - Socket.IO
 * - Cradle
 */

var express = require('express');

var app = express.createServer();

require('./mvc').boot(app);

app.listen(80);

var socketApp = express.createServer();

socketApp.listen(3000);

require('./socket').boot(socketApp);