    var http = require('http');
    var fs = require('fs');
    var htmlFile="";
   // var $ = require('jQuery');

    http.createServer(function (req, res)
     {
      fs.readFile('./home.html', function(err, data) 
      {
        if (err)
          {
            throw err;
          }
    htmlFile = data;
     res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(htmlFile)
      res.end();
      });
    }).listen(80, "10.1.0.24");
    console.log('Server running at http://10.1.0.24:80/');