var http = require('http');
var fs = require('fs');
var htmlFile = "";
var qs = require('querystring');
// var $ = require('jQuery');

//////*hostURL*//////
var hostURL ="192.168.0.159"

//////CreateServer at hostURL with home.html
http.createServer(function (req, res) {
    fs.readFile('./home.html', function (err, data) {
        if (err) {
            throw err;
        }
        htmlFile = data;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlFile)
        res.end();

    });
}).listen(80, hostURL);
console.log('Server running at http://' + hostURL + ':80/');
recievePOST();

//  /*
//////if POST recieved do xxx
//Make into Funcion
//error with  "req.method"
function recievePOST(req) {
if (req.method === 'POST') {
    var body = '';
    console.log("POST recieved");
    req.on('data', function (data) {
        body += data;
        console.log(body);

        var string = body + " \r\n";
        fs.open('alarmIndex.txt', 'a');
        fs.appendFile('alarmIndex.txt', string, function (err) {
            if (err)
                return console.log(err + "error appending new alarm to alarmIndex");
            console.log("successfully appended new alarm to Alarm Index" + string);
        });
    });

    req.on('end', function () {
        var post = qs.parse(body);
        // use post['blah'], etc.
    });
}};
//  */

  /*
//////if GET recieved do xxx
//Make function
    if (req.method === 'GET') {
        console.log('get recieved')
    }
//*/

/*
function alarm(){
    if alarm goes off turn light on
    }
//////SAMPLE Alarm Code////// 
function alarm() {
                note = document.arlm.message.value;
                if (note == '') {note = 'ALARM!!';}

                hrs = document.arlm.hr.value;
                min = document.arlm.mts.value;
                apm = document.arlm.am_pm.value;

            if ((document.hours.clock.value == hrs) &&
                (document.minutes.clock.value == min) &&
                (document.ampm.clock.value == apm)) {
                if (playit)
                playmusic()
                else
                alert(note);
                return false}

            if (hrs == '') {alert('The Hour field is empty'); return false}
            if (min == '') {alert('The Minute field is empty'); return false}
            if (apm == '') {alert('The am/pm field is empty'); return false}

            if (hrs.length == 1) {document.arlm.hr.value = '0' + hrs}
            if (min.length == 1) {document.arlm.mts.value = '0' + min}
            if (hrs.length > 2) {alert('The Hour is wrongly typed.'); return false}
            if (min.length > 2) {alert('The Minute is wrongly typed.'); return false}
            if (apm != 'am' && apm != 'pm' ) {alert('The am/pm is wrongly typed.'); return false}

            setTimeout("alarm()", 1000);}
*/

//////convert times in index to unix timestamps