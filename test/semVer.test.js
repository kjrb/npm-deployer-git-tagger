/* global describe, it */

const chai = require('chai');
const semVer = require('semver');

describe('semver behavior tests', function () {
	describe('test version equality', function () {
		it('versions should be equal for exact match', function () {
			const vA = '1.0.0';
			const vB = '1.0.0';

			chai.expect(semVer.eq(vA, vB)).is.true;	
		});	
		
		it('versions should be equal when prefix "v" used', function () {
			const vA = '1.0.0';
			const vB = 'v1.0.0';

			chai.expect(semVer.eq(vA, vB)).is.true;	
		});
		
		it('versions should be equal when suffix used', function () {
			const vA = '1.0.0-latest';
			const vB = '1.0.0-latest';

			chai.expect(semVer.eq(vA, vB)).is.true;	
		});			
	});	
	
	describe('test version inequality', function () {
		it('version A should be greater than version B - when no v prefix', function () {
			const vA = '1.0.1';
			const vB = '1.0.0';

			chai.expect(semVer.gt(vA, vB)).is.true;	
		});	
		
		it('version A should be greater than version B - with v prefix', function () {
			const vA = '1.0.1';
			const vB = 'v1.0.0';

			chai.expect(semVer.gt(vA, vB)).is.true;	
		});	
		
		it('version B should be lesser than version A - with v prefix', function () {
			const vA = '1.0.1';
			const vB = 'v1.0.0';

			chai.expect(semVer.lt(vB, vA)).is.true;	
		});	
		
		it('version beta should be greater than verison alpha', function () {
			const vA = '1.0.0-beta';
			const vB = 'v1.0.0-alpha';

			chai.expect(semVer.lt(vB, vA)).is.true;	
		});
		
		it('version beta should be greater than verison alpha', function () {
			const vA = '1.0.0-x';
			const vB = 'v1.0.0-y';

			chai.expect(semVer.gt(vB, vA)).is.true;	
		});			
	});	
});