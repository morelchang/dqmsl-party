var http = require('http');
var express = require('express');
var app = express();
app.use(express.static('./'));
var server = http.createServer(app);
server.listen(8080,'127.0.0.1',function() {
    console.log('listen to 127.0.0.1:8080');
});
