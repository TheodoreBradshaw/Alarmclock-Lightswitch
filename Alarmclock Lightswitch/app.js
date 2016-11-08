    var http = require('http');
    var fs = require('fs');
    var htmlFile="";
   // var $ = require('jQuery');

    http.createServer(function (req, res)
     {
      fs.readFile('./home.html', function(err, data){
        if (err){
            throw err;
          }
    htmlFile = data;
     
     if (req.method === 'POST') {
        var body = '';
        console.log("success");
        req.on('data', function (data) {
            body += data;
            console.log("success");

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            // use post['blah'], etc.
        });
    }

     res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(htmlFile)
      res.end();

      
      });
    }).listen(80, "10.1.0.91");
    console.log('Server running at http://10.1.0.24:80/');

    var qs = require('querystring');