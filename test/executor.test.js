/* global describe, it */

const assert = require('assert');
import executor from '../lib/executor.js';

describe('executor tests', function () {
	describe('verify interface', function () {
		it('should have checkIfTagForVersionExists method', function () {
			let ex = executor();
			assert.ok(ex.checkIfTagForVersionExists != null);
		});
		
		it('should have getLatestPublishedVersion method', function () {
			let ex = executor();
			assert.ok(ex.getLatestPublishedVersion != null);
		});		
		
		it('should have publish method', function () {
			let ex = executor();
			assert.ok(ex.publish != null);
		});
	});	
});