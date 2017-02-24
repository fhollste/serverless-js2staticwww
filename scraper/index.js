'use strict';

const path = require('path');
const childProcess = require('child_process');

const phantomJsPath = require('phantomjs-prebuilt').path;

exports.scrape = function(url, callback) {
	
  const childArgs = [path.join(__dirname, 'phantomjs-script.js')];
  const phantom = childProcess.execFile(phantomJsPath, childArgs, {
    env: {
      URL: url
    },
    maxBuffer: 2048*1024
  });

  let stdout = '';
  let stderr = '';

  phantom.stdout.on('data', function(data) {
    stdout += data;
  });

  phantom.stderr.on('data', function(data) {
    stderr += data;
  });

  phantom.on('uncaughtException', function(err) {
    console.log('uncaught exception: ' + err);
  });

  phantom.on('exit', function(exitCode) {
    if (exitCode !== 0) {
      return callback(true, stderr);
    }
    callback(null, stdout);
  });
};
