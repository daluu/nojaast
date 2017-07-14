#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var os = require('os');
var dns = require('dns');

//express.js related stuff for web/API server
var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
//configs
var config = require('./config.js');
//get app & versioning info
var appInfo = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

var argv = require('yargs')
    .usage('Usage: $0 [options]')
    .example('$0 -p 8080', 'start server listening on port 8080')
    .describe('v', 'verbose/debugging output')
    .default('v', false)
    .alias('v', 'verbose')
    .describe('a', 'hostname or IP address to listen on')
    .nargs('a', 1)
    .default('a', 'localhost')
    .alias('a', 'address')
    .describe('p', 'specify port for server to listen on')
    .nargs('p', 1)
    .default('p', 8080)
    .alias('p', 'port')
    .help('h')
    .describe('h', 'display help/usage info')
    .alias('h', 'help')
    .argv;

var app = express();
app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//and helper methods - parsers, API proxies, DB querying, etc.
eval.apply(global, [fs.readFileSync('./lib/shared_components.js').toString()]); //returns sharedComponents object/class
sharedComponents.config = config;
sharedComponents.argv = argv;

//express.js related modules for web/API server
sharedComponents.request = require('sync-request');
sharedComponents.querystring = require('querystring');

//for server side generation of HTML content (d3, svgs, pdfs, etc.)
/*
  sharedComponents.jsdom = require('jsdom');
  sharedComponents.svg2png = require('svg2png');
  sharedComponents.chart = require('./lib/chart/render.js');
*/

//constants & configs
//define chart filenames & variables
var content = '<svg id="box"></svg>';
global.box = undefined;

//for human viewable health check / info
app.get('/about', function (req, res) {
    var appVersion = appInfo.name + " v" + appInfo.version;
    var info = "<html><head><title>" + appVersion + "</title></head><body><p>";
    info += appVersion + " up and running.</p><p>";
    info += appInfo.description + "</p><p>";
    info += "Go to <a href=\"/\">homepage</a> for more stuff.</p></body></html>";
    res.send(info);
});

//for automated/scripted version info & health check
app.get('/version', function (req, res) {
    res.json({'version': appInfo.version});
});

//serve client side pages that make AJAX calls (or not) to this server for data
//where the server may proxy those calls to other servers
app.use('/home', express.static(__dirname + '/home'));

//homepage & other files
app.use(serveStatic('home', {'index': ['index.html', 'index.htm', 'default.html', 'default.htm'], 'dotfiles': 'ignore'}));
app.get('/', function (req, res) {
    res.redirect('/home');
});

//expose uploaded (or other) files for download
app.use('/downloads', express.static(__dirname + '/public/files')); //or /public/uploads, etc.

//### start server side APIs & server methods that generate HTML web content dynamically
//or return API/REST responses
//...most of which come from separate module files loaded from routes subdirectory
function recursiveRoutes(folderName) {
    fs.readdirSync(folderName).forEach(function(file) {

        var fullName = path.join(folderName, file);
        var stat = fs.lstatSync(fullName);

        if (stat.isDirectory()) {
            recursiveRoutes(fullName);
        } else if (file.toLowerCase().indexOf('.js')) {
            require('./' + fullName)(app, argv, config, sharedComponents);
	        if(argv.verbose){
		        console.log("loading routes from file: " + fullName);
	        }
        }
    });
}
recursiveRoutes('routes');
//### end server side APIs

//try force set cache control to browser?
app.use(function (req, res, next) {
    if (req.url.match(/^\/.+(css|js|img|htm|html).*/)) {
        res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
	res.setHeader('Pragma','no-cache');
	res.setHeader('Expires','Thu, 19 Nov 1981 08:52:00 GMT');
    }
    next();
});

process.on('SIGINT', function() {
    console.log("Attempting graceful shutdown...");
    process.exit();
});

console.log("\n%s v%s started", appInfo.name, appInfo.version);

app.listen(argv.port, argv.address, function () {
    console.log("\nListening by default/provided IP/hostname at: http://%s:%s\n", argv.address, argv.port);
});

if(argv.address != "0.0.0.0"){
    try{
	if(typeof os.hostname() !== 'undefined' && argv.address != os.hostname()){
	    dns.lookup(os.hostname(), function(err,address,family){
		if(address != argv.address){
		    app.listen(argv.port, address, function(){
			console.log("\nListening by automatic hostname lookup & it's matching IP at: http://%s:%s & http://%s:%s\n",os.hostname(),argv.port,address,argv.port);
		    });
		}
	    });
	}
    }catch(err){
	//no need to log anything here?
	//console.log(err);
    }
}
