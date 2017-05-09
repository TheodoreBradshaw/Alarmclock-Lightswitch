var http = require('http');
var fs = require('fs');
var htmlFile = "";
var qs = require('querystring');
var schedule = require('node-schedule');
var exec = require('child_process').exec;
var net = require('net');
var hostIP

function getNetworkIP(callback) {
  var socket = net.createConnection(80, 'www.google.com');
  socket.on('connect', function() {
    callback(undefined, socket.address().address);
    socket.end();
  });
  socket.on('error', function(e) {
    callback(e, 'error');
  });
}
getNetworkIP(function (error, hostIP) {
    console.log(hostIP);
    if (error) {
        console.log('error:', error);
    }
});

http.createServer(function (req, res) {
    fs.readFile('./home.html', function (err, data) {
        if (err) { throw err; }
        htmlFile = data;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlFile)
        res.end();
    });
	}).listen(80, hostIP);

console.log('Server running at http://' + hostIP + ':80/');