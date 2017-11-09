//we need http module to create http server
var http = require('http');
//we need fs module to read files from the drive
var fs = require('fs');
//we need URL module to parse the URI of the request
var url = require('url');
//we need path module to extract file extension
const path = require('path');

//save server port on global variable
var port = 8080;

//these are the allowed files to be accessed publicly by clients without server permissions
var allowedExtensions = ['.css', '.jpg', '.png' , '.gif', '.tiff', '.txt'];

//for each file type, define its associated mime type
const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };
 
//create and start the server 
http.createServer(function (req, res) {

	//get the requested URI from the request
	var adr = req.url;
	//parse the query string parameters
	var q = url.parse(adr, true);

	console.log(q.pathname);
	
	//find the file extension of the request if it is trying to access a file on the server
	const ext = path.parse(q.pathname).ext;
	
	//if it file extension is excempted from server permission, just be nice and give it to  the client
	if (allowedExtensions.indexOf(ext) > -1 ) 
	{
		//read the file aschynrounosly, when done use the callback to send it to the client
		fs.readFile("." + q.pathname, function(err, data) 
		{
			//check if there is any error happened during reading the file
			if(err)
			{
				//error, file was not read successfully
				//just tell the client file was not found, by setting appropriate response code
				res.writeHead(404, {'Content-type' : 'text/html' });
				//send the response
				res.end();
				//return and end the function
				return;
			}
			//if no error then lets prepare the file to be sent
			//first confirm it is success in the header and confirm the mime type of the file
			res.writeHead(200, {'Content-type' : mimeType[ext] });
			//write the file contents to the response body
			res.write(data);
			//now send the response to the client
			res.end();
		});
						
	}
	//if the request is not about accessing permissible file, then lets handle it by the server himself
	else
	{
		//assume the default language to serve is english
		var langToServe = 'en';
		
		//make sure the client did not ask for another language
		//we can find this information stored in the query string, we assume the varibale is called lang
		if(q.query.lang === 'fr')
		{
			//change the default language to frensh
			langToServe = 'fr';
		}
		//open the html file, read its contents and send it to the client
		fs.readFile('./frontEnd/home.html', function(err, data) 
		{
			if(err)
			{
				//error, file was not read successfully
				//just tell the client file was not found, by setting appropriate response code
				res.writeHead(404, {'Content-type' : 'text/html' });
				//send the response
				res.end();
				//return and end the function
				return;
			}
			//if no error then lets prepare the file to be sent
			//first confirm it is success in the header and confirm the mime type of the data to send
			res.writeHead(200, {'Content-Type': 'text/html'});
			//write the data in the response body
			res.write(data);
			//send the response
			res.end();
			console.log("--------");
		});
	}
}).listen(port);

console.log("server running on port:" + port);

