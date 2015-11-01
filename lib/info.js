"use strict"

const util = require("util");
const tl = require('vso-task-lib');

exports.showAllVars = function showAllVars() {
	const allVars = [
		'system.debug',
		'system.teamProject',
		'system.teamFoundationServerUri',
		'system.teamFoundationCollectionUri',
		'system.collectionId',
		'system.defaultWorkingDirectory',
		'build.definitionName',
		'build.definitionVersion',
		'build.buildNumber',
		'build.buildUri',
		'build.buildId',
		'build.queuedBy',
		'build.queuedById',	
		'build.requestedFor',
		'build.requestedForId',
		'build.sourceVersion',
		'build.sourceBranch',
		'build.sourceBranchName',	
		'build.repository.name',
		'BUILD_REPOSITORY_NAME',
		'build.repository.provider',
		'BUILD_REPOSITORY_PROVIDER',
		'build.repository.clean',
		'BUILD_REPOSITORY_CLEAN',
		'build.repository.uri',
		'BUILD_REPOSITORY_URI',
		'build.repository.tfvc.workspace',
		'build.repository.tfvc.shelveset',
		'build.repository.git.submoduleCheckout',
		'BUILD_REPOSITORY_GIT_SUBMODULECHECKOUT',
		'agent.name',
		'agent.id',
		'agent.homeDirectory',
		'agent.rootDirectory',
		'agent.workFolder',
		'build.repository.localPath',
		'BUILD_REPOSITORY_LOCALPATH',
		'build.sourcesDirectory',
		'build.artifactsStagingDirectory',
		'build.stagingDirectory',
		'agent.buildDirectory'
		];
	
	allVars.forEach(function(v) {
		console.log(util.format("%s = %s", v, tl.getVariable(v)));
	})
	
	//tl.setVariable('xxx', '13');
	//console.log(tl.getVariable('xxx'));
}