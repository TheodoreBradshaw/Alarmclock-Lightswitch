function createFile (){
fs = require('fs');
var string = "06:30 Mo, Tu, We, Th, Fr \r\n";
fs.appendFile('alarmIndex.txt', string, function (err) {
    if (err) 
        return console.log(err);
    console.log("successfully posted " + string + " to file alarmIndex.txt");
});
}
createFile();