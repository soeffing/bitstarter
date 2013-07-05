#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://stark-ravine-2796.herokuapp.com";
var rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var getHtmlFromUrl = function(url){
  console.log(url);  
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile, url_data) {
    if (htmlfile !== null) {
      $ = cheerioHtmlFile(htmlfile);
      console.log('file');
    } else {
      $ = cheerio.load(url_data);

    }
    var checks = loadChecks(checksfile).sort();
    console.log(checks);
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

if(require.main == module) {
    program
        .option('-c, --checks ', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
        .option('-f, --file ', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
        .option('-u, --url  ' , 'URL to be parsed', getHtmlFromUrl, URL_DEFAULT)
        .parse(process.argv);
    if (program.file) {
      var checkJson = checkHtmlFile(program.file, program.checks, null);
      var outJson = JSON.stringify(checkJson, null, 4);
    } else if (program.url) {
       console.log('condition passwed');
       rest.get(program.url.toString()).on('complete', function(data) {
	  var checkJson = checkHtmlFile(null, program.checks, data);
          var outJson = JSON.stringify(checkJson, null, 4); 
            console.log(checkJson);
	     console.log(outJson);  
      }); 
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
