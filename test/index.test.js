/* global describe, it */

const chai = require('chai');
const util = require('util');

import * as worker from '../lib/index.js';

const info = {
	packageName: 'a',
	currentVersion: '1.0.0',
	appdir: './'
};

const shellRunnerMock = {
	exec: function (cmd, callback) {
		if (cmd.indexOf('npm view') > -1) {
			return { output: 'v0.0.1' };
		}
		else if (cmd.indexOf('git ls-remote') > -1) {
			return { output: null };
		}
		else if (cmd.indexOf('git tag') > -1) {
			return { output: null };
		}
		else if (cmd.indexOf('npm publish') > -1) {
			callback(0);
		}
		else if (cmd.indexOf('git push') > -1) {
			callback(0);
		}
		else {
			return null;
		}
	},
	cd: function () {
		return 0;
	}
};

describe('npm deployer and git tagger', function () {
	describe('verify that initialization throws error if options object not set', function () {
		it('options argument needs to be set', function () {

			chai.expect(function() { 
				worker.publishAndTagIfNewer(); 
			}).to.throw();			
			
			chai.expect(function() { 
				worker.publishAndTagIfNewer(null); 
			}).to.throw();
			
			chai.expect(function() { 
				worker.publishAndTagIfNewer({}); 
			}).to.throw();		
			
		});
	});	
	
	describe('verify that command are executed in expected order for happy path', function () {
		
		const commands = [];
		let dirChanged = false;		

		const runner = {
			exec: function(cmd, callback) {
				commands.push(cmd);
				return shellRunnerMock.exec(cmd, callback);
			},
			cd: function(cmd) {
				dirChanged = true;
				return shellRunnerMock.cd(cmd);
			}
		};
			
		const expectedResult = true;	
		const actualResult = worker.publishAndTagIfNewer({ shellRunner: runner, moduleInfo: info });
			
		it('package should be published and git tag should be created', function () {		
			chai.expect(expectedResult === actualResult).is.true;
		});		
		
		it('npm version command should be executed first', function () {			
			const expectedFirstCommand = util.format('npm view %s version', info.packageName);
			const actualFirstCommand = commands[0];

			chai.expect(expectedFirstCommand === actualFirstCommand).is.true;			
		});
		
		it('git tag search should be executed second', function () {				
			const expectedSecondCommand = util.format('git ls-remote origin refs/tags/%s', info.currentVersion);
			const actualSecondCommand = commands[1];

			chai.expect(expectedSecondCommand === actualSecondCommand).is.true;	
		});
		
		it('npm publish command should be executed third', function () {			
			const expectedThirdCommand = util.format('npm publish');
			const actualThirdCommand = commands[2];
			
			chai.expect(expectedThirdCommand === actualThirdCommand).is.true;	
		});
		
		it('git tag should be executed forth', function () {			
			const expectedFourthCommand = util.format('git tag -a %s -m v%s', info.currentVersion, info.currentVersion);
			const actualFourthCommand = commands[3];
			
			chai.expect(expectedFourthCommand === actualFourthCommand).is.true;
		});
		
		it('git push tag should be executed forth', function () {			
			const expectedFifthCommand = util.format('git push --tags');
			const actualFifthCommand = commands[4];
			
			chai.expect(expectedFifthCommand === actualFifthCommand).is.true;
		});
		
		it('dir change should have been called', function () {		
			chai.expect(dirChanged === true).is.true;			
		});
	});	
	
	describe('verify that command are executed in expected order for no package in npm yet', function () {
		
		const commands = [];

		const runner = {
			exec: function(cmd, callback) {
				commands.push(cmd);
				if (cmd.indexOf('npm view') > -1) {
					return { output: '  ERR! code E404  ' };
				}
				else {
					return shellRunnerMock.exec(cmd, callback);
				}
			},
			cd: function(cmd) {
				return shellRunnerMock.cd(cmd);
			}
		};
			
		const expectedResult = true;	
		const actualResult = worker.publishAndTagIfNewer({ shellRunner: runner, moduleInfo: info });
			
		it('package should be published and git tag should be created', function () {		
			chai.expect(expectedResult === actualResult).is.true;
		});	
		
		it('all commands should have been executed', function () {		
			chai.expect(commands.length === 5).is.true;
		});			
		
	});	
	
	describe('verify that package is not published if newer version exists', function () {
		
		const commands = [];

		const runner = {
			exec: function(cmd, callback) {
				commands.push(cmd);
				if (cmd.indexOf('npm view') > -1) {
					return { output: 'v2.0.1' };
				}
				else {
					return shellRunnerMock.exec(cmd, callback);
				}
			},
			cd: function(cmd) {
				return shellRunnerMock.cd(cmd);
			}
		};
			
		const expectedResult = false;	
		const actualResult = worker.publishAndTagIfNewer({ shellRunner: runner, moduleInfo: info });
			
		it('package should not be published', function () {		
			chai.expect(expectedResult === actualResult).is.true;
		});		
		
	});	
	
	describe('verify that error thrown if npm publish does not succeed', function () {
		
		const commands = [];

		const runner = {
			exec: function(cmd, callback) {
				commands.push(cmd);
				if (cmd.indexOf('npm publish') > -1) {
					callback(1, '  npm ERR! publish Failed PUT 402  ');
				}
				else {
					return shellRunnerMock.exec(cmd, callback);
				}
			},
			cd: function(cmd) {
				return shellRunnerMock.cd(cmd);
			}
		};			
		
		chai.expect(function () {
			worker.publishAndTagIfNewer({ shellRunner: runner, moduleInfo: info });
		}).to.throw();	
		
		it('not all commands should have been executed', function () {
			chai.expect(commands.length === 3).is.true;
		});			
		
	});	
	
	describe('verify that error thrown if npm git tagging does not succeed', function () {

		const commands = [];

		const runner = {
			exec: function (cmd, callback) {
				commands.push(cmd);
				if (cmd.indexOf('git push --tags') > -1) {
					callback(1, '  failure  ');
				}
				else {
					return shellRunnerMock.exec(cmd, callback);
				}
			},
			cd: function (cmd) {
				return shellRunnerMock.cd(cmd);
			}
		};

		chai.expect(function () {
			worker.publishAndTagIfNewer({ shellRunner: runner, moduleInfo: info });
		}).to.throw();

		it('not all commands should have been executed', function () {
			chai.expect(commands.length === 5).is.true;
		});

	});	
});

