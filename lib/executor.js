"use strict";

const util = require("util");

var commandRunner, packageInfo;

function checkIfTagForVersionExists() {
	
	const getTagForCurrentVersionCmd =  util.format('git ls-remote origin refs/tags/%s', packageInfo.currentVersion);	
	
	console.log('Executing: ' + getTagForCurrentVersionCmd);	
	const tagForCurrentVersion = commandRunner.exec(getTagForCurrentVersionCmd, {silent: true}).output;
	
	if (tagForCurrentVersion) {		
		console.log('Git tag for current version: ' + tagForCurrentVersion);
		return true;
	}
	else {
		console.log('Git tag for current version does not exit');
		return false;
	}	
}

function getLatestPublishedVersion() {
	
	const versionCmd = util.format("npm view %s version", packageInfo.packageName);
	const packageNotFoundResponse = "ERR! code E404";
	let latestPublishedVersion;

	console.log('Executing: ' + versionCmd);	
	latestPublishedVersion = commandRunner.exec(versionCmd, {silent: true}).output;			
	
	if (!latestPublishedVersion) {
		throw { name: "Package Info retrival error", message: "Did not receive valid response from npm registry." }
	}

	if (latestPublishedVersion && latestPublishedVersion.indexOf(packageNotFoundResponse) > -1) {
		console.log(packageNotFoundResponse + " - Package not in the registry.");
		return "0.0.0";
	}

	console.log('latest published package version is: ' + latestPublishedVersion);
	return latestPublishedVersion;
}

function publish() {

	const npmPublishCmd = 'npm publish';	
	const gitCreateTagCmd = util.format("git tag -a %s -m v%s", packageInfo.currentVersion, packageInfo.currentVersion);
	const gitPushTag = "git push --tags";
	
	console.log('Executing: ' + npmPublishCmd);
	commandRunner.cd(packageInfo.appdir + '\..');
	commandRunner.exec(npmPublishCmd, function(code, output) {
		console.log('Npm publish Exit Code:' + code);
		console.log('Npm publish output: ' + output);
	
		if (code === 0) {
			console.log('Npm publish succeeded. Executing ' + gitCreateTagCmd);

			commandRunner.exec(gitCreateTagCmd);
			console.log("Tag Created. Executing " + gitPushTag);
			commandRunner.exec(gitPushTag, function (code, output) {
				console.log('Git tagging Exit Code:' + code);
				console.log('Git tagging output: ' + output);

				if (code === 0) {
					console.log('Git tagging succeeded.');
				}
			});
		}
   });
}

module.exports = function(shellRunner, moduleInfo) {
	commandRunner = shellRunner;
	packageInfo = moduleInfo;
	
	return {
		checkIfTagForVersionExists: checkIfTagForVersionExists,
		getLatestPublishedVersion: getLatestPublishedVersion,
		publish: publish
	}
}