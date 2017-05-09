var http = require('http');
var fs = require('fs');
var htmlFile = "";
var qs = require('querystring');
var schedule = require('node-schedule');
var exec = require('child_process').exec;
var readline = require('readline');
var alarms = [];

//////*hostIP*//////
var hostIP = "192.168.1.77";

loadAlarms();

//////CreateServer at hostIP with home.html
http.createServer(function (req, res) {
    var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var URL = req.url;
        if (req.method === 'GET') {
            if (URL == "/app.js/pull") {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(alarms))
                res.end();
            } else {
                fs.readFile('/home/pi/HipLight/home.html', function (err, data) {
                    if (err) { throw err; }
                    htmlFile = data;
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(htmlFile)
                    res.end();
                })
            }
        }
        if (req.method === 'POST') {
            //post alarm
            var post = qs.parse(body);
            console.log(JSON.parse(body));
            // console.log(URL);

            if (URL == "/app.js/add") {
                if (!setNewAlarm(JSON.parse(body))) {
                    res.statusCode = 500;
                } else {
                    indexAlarm(JSON.parse(body));
                }
            }

            if (URL == "/app.js/delete") {
                if (!deleteAlarm(JSON.parse(body))) {
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

    //////post to alarmIndex//////


}).listen(80, hostIP);
console.log('Server running at http://' + hostIP + ':80/');

function loadAlarms() {
    if (!fs.existsSync('/home/pi/HipLight/alarmIndex.txt')) {
        return;
    }
    var readerInterface = readline.createInterface({
        input: fs.createReadStream('/home/pi/HipLight/alarmIndex.txt')
    });
    readerInterface.on('line', function (line) {
        console.log('Line from file:', line);
        var stored = JSON.parse(line)
        setNewAlarm(stored)
    });
}

function indexAlarm(alarm) {
    var string = JSON.stringify(alarm) + "\r\n";
    //var string = "hello world \r\n";
    //fs.open('/home/pi/HipLight/alarmIndex.txt', 'a', function (err, fd) {"
    var fd = '/home/pi/HipLight/alarmIndex.txt'
    if (string.length > 3) {
        fs.appendFile(fd, string, function (err) {
            if (err)
                return console.log(err + "error appending new alarm to alarmIndex");
            console.log("successfully appended new alarm to Alarm Index" + string);
        });
    }
    // });
    //fs.close(fd, function () { })
}

function setNewAlarm(alarm) {
    if (alarm == null || alarm == undefined) {
        console.log("invalid alarm")
        return false;
    }
    for (var i = 0; i < alarms.length; i++) {
        if (matchingAlarms(alarm, alarms[i])) {
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
    exec("sudo /home/pi/HipLight/lightOn.out");
}

function matchingAlarms(alarm1, alarm2) {
    //if alarm1 === alarm2 -> delete alarm
    if (alarm1.minute == alarm2.minute && alarm1.hour == alarm2.hour && JSON.stringify(alarm1.days) == JSON.stringify(alarm2.days)) {
        return true;
    };
    return false;
}

function deleteAlarm(alarm) {
    for (var i = 0; i < alarms.length; i++) {
        if (matchingAlarms(alarm, alarms[i])) {
            alarms[i].alarmJob.cancel();
            alarms.splice(i, 1);

            var readerInterface = readline.createInterface({
                input: fs.createReadStream('/home/pi/HipLight/alarmIndex.txt')
            });
            readerInterface.on('line', function (line) {
                console.log('Line from file:', line);
                var stored = JSON.parse(line)
                if (matchingAlarms(stored, alarm)) {
                    //delete from /home/pi/HipLight/alarmIndex.txt
                    fs.unlinkSync('/home/pi/HipLight/alarmIndex.txt')

                    for(var a= 0; a < alarms.length; a++){
                        indexAlarm(alarms[a]);
                    }
                }
            });

            console.log("Alarm deleted" + JSON.stringify(alarm));
            return true;
        }
    }
    return false;
    /* You can invalidate the job with the cancel() method: */
}
