var http = require('http');
var fs = require('fs');
var htmlFile = "";
var qs = require('querystring');
var schedule = require('node-schedule');
var exec = require('child_process').exec;
// var $ = require('jQuery');
var alarms = [];


//////*hostURL*//////
var hostURL = "10.1.0.24"
//////CreateServer at hostURL with home.html
http.createServer(function (req, res) {
    fs.readFile('./home.html', function (err, data) {
        if (err) { throw err; }
        htmlFile = data;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlFile)
        res.end();
    });

    //  /*

    var body = '';
    console.log("POST recieved");
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        //var post = qs.parse(body);
        //console.log(JSON.parse(body));
        //setNewAlarm(JSON.parse(body));

        if (req.method === 'POST') {
            //post alarm
            var post = qs.parse(body);
            console.log(JSON.parse(body));
            setNewAlarm(JSON.parse(body));

        }
        if (req.method === 'DELETE') {
            //delete alarm
            deleteAlarm(/*AlarmID*/)
        }
        //console.log(JSON.stringify(body, null, 2));
        // use post['blah'], etc.
    });

    /*
    //post to alarmIndex

    var string = body + " \r\n";
    fs.open('alarmIndex.txt', 'a');
    fs.appendFile('alarmIndex.txt', string, function (err) {
        if (err)
            return console.log(err + "error appending new alarm to alarmIndex");
        console.log("successfully appended new alarm to Alarm Index" + string);   
    });
    */

}).listen(80, hostURL);

console.log('Server running at http://' + hostURL + ':80/');

function setNewAlarm(alarm) {
    for (i = 0; i < alarms.length; i++) {
        if (alarmsMatch(alarm, alarm[i])) {
            console.log("2 Identicle Alarms Found!")
            return;
        }
    }
    var alarmJob = schedule.scheduleJob('0 '/*seconds*/ + alarm.minute + ' ' + alarm.hour + ' * * '/*Month*/ + alarm.days.join(',')/*Days of the week*/, handleAlarm);     //schedule alarm
    alarm.alarmJob = alarmJob;
    alarms.push(alarm);
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

function deleteAlarm(/*AlarmID*/){
    /* You can invalidate the job with the cancel() method: */
}