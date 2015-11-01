"use strict";

const semVer = require('semver');
const util = require('util');
const info = require('./info');
const shellExecutor = require('./executor');

function MakeError(name, msg) {
	return { message: msg, name: name }
}


module.exports.publishAndTagIfNewer = function doWork(options) {	

	if (!options || !options.shellRunner || !options.moduleInfo) {
		throw MakeError(
			'Initialization error', 
			'options.shellRunner and options.moduleInfo objects need to be set'
		)
	}
	
	const executor = shellExecutor(options.shellRunner, options.moduleInfo);
	const moduleInfo = options.moduleInfo;		

	const latestPublishedVersion = executor.getLatestPublishedVersion();	
	const hasTag = executor.checkIfTagForVersionExists();	
	const isNewer = semVer.gt(moduleInfo.currentVersion, latestPublishedVersion);	

	if (isNewer && !hasTag) {
		executor.publish();	
		return true;	
	}
	else if (isNewer && hasTag) {
		// something wrong, we should not proceed
		let errorMessage = util.format('Git tag should not exist for %s for version %s.', moduleInfo.packageName, moduleInfo.currentVersion);		
		console.error(errorMessage);
		throw MakeError('Publishing error.', errorMessage);
	}
	else {
		console.log('Package version is not greater than the latest published version. Package not published.');
		return false;
	}
	// we still missing the case in which the version is not newer and is missing a tag 
	// it would mean that something in the past went wrong
}




