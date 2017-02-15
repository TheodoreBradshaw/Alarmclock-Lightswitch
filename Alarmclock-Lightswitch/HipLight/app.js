var http = require('http');
var fs = require('fs');
var htmlFile = "";
var qs = require('querystring');
var schedule = require('node-schedule');
var exec = require('child_process').exec;
// var $ = require('jQuery');
var alarms = [];

//////*hostIP*//////
var hostIP = "10.1.0.24";

//////CreateServer at hostIP with home.html
http.createServer(function (req, res) {
    var body = '';
   
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        if(req.method === 'GET') {
            fs.readFile('./home.html', function (err, data) {
            if (err) { throw err; }
            htmlFile = data;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlFile)
            res.end();
            });
        }
        if (req.method === 'POST') {
            //post alarm
            var post = qs.parse(body);
            console.log(JSON.parse(body));
            var URL = req.url;
            console.log(URL);
            if(URL == "/app.js/add"){
                if(!setNewAlarm(JSON.parse(body))){
                    res.statusCode = 500;
                }
            }
            if(URL == "/app.js/delete"){
                if(!deleteAlarm(JSON.parse(body))){
                    res.statusCode = 500;
                }
            }
            console.log("POST recieved"); 
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end();
        }
        //console.log(JSON.stringify(body, null, 2));
        // use post['blah'], etc.
    });

    /*
    //////post to alarmIndex//////
    var string = body + " \r\n";
    fs.open('alarmIndex.txt', 'a');
    fs.appendFile('alarmIndex.txt', string, function (err) {
        if (err)
            return console.log(err + "error appending new alarm to alarmIndex");
        console.log("successfully appended new alarm to Alarm Index" + string);   
    });
    */
}).listen(80, hostIP);
console.log('Server running at http://' + hostIP + ':80/');


function setNewAlarm(alarm) {
    if(alarm == null){
        console.log("invalid alarm")
        return false;
    }
    for (i = 0; i < alarms.length; i++) {
        if (alarmsMatch(alarm, alarm[i])) {
            console.log("2 Identicle Alarms Found!")
            return false;
        }
    }
    var alarmJob = schedule.scheduleJob('0 '/*seconds*/ + alarm.minute + ' ' + alarm.hour + ' * * '/*Month*/ + alarm.days.join(',')/*Days of the week*/, handleAlarm);     //schedule alarm
    alarm.alarmJob = alarmJob;
    console.log("pushing alarm: " + JSON.stringify(alarm));
    alarms.push(alarm);
    console.log("scheduled new alarm");
    return true;
}

function handleAlarm() {
    //execute alarm 
    console.log("Blink...Blink");
    exec("sudo ./lightOn.out");
}

function alarmsMatch(alarm1, alarm2) {
    //if alarm1 === alarm2 -> delete alarm
    if (alarm1.minute == alarm2.minute && alarm1.hour == alarm2.hour && JSON.stringify(alarm1.days) == JSON.stringify(alarm2.days)) {
        return true;
    };
    return false;
}

function deleteAlarm(alarm) {
    for (i = 0; i < alarms.length; i++) {
        if (alarmsMatch(alarm, alarms[i])) {
            alarms[i].alarmJob.cancel();
            console.log("Alarm deleted" + JSON.stingify(alarm));
            return true;
        }
    }
    return false;
    /* You can invalidate the job with the cancel() method: */
}