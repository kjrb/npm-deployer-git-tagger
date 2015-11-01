/*global __dirname*/
"use strict"

const path = require("path");
const appdir = path.resolve(__dirname, '../../');
const packageInfo = require(path.join(appdir, 'package.json'));
const worker = require("./lib/index");
const shelljs = require("shelljs");

const currentVersion = packageInfo.version;
const packageName = packageInfo.name;	

console.log('package name: ' + packageName);
console.log('current package version: ' + currentVersion);

worker.publishAndTagIfNewer({ 
	shellRunner: shelljs,
	moduleInfo: {
		packageName: packageName,
		currentVersion: currentVersion,
		appdir: appdir	
	}
});