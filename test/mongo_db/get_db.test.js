'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const chai_as_promised = require('chai-as-promised');
chai.use(chai_as_promised);

const get_db = require('../../src/mongo_db/get_db');
const MongoClient = require('mongodb').MongoClient;

describe('#get_db', function () {
	describe('For invalid parameters', () => {
		describe('when MongoClient is not passed', () => {
			it('should be rejected with an TypeError', () => {
				return expect(get_db()).to.eventually.be.rejectedWith(TypeError, 'MongoClient or its instance is expected');
			});
		});

		describe('when mongodb_uri is either', () => {
			describe('missing', () => {
				it('should be rejected with an Error', () => {
					return expect(get_db(MongoClient)).to.eventually.be.rejectedWith(Error, 'Invalid MongoDB URI');
				});
			});

			describe('or equal to empty string', () => {
				it('should be rejected with an Error', () => {
					return expect(get_db(MongoClient, '')).to.eventually.be.rejectedWith(Error, 'Invalid MongoDB URI');
				});
			});
		});
	});

	describe('For valid parameters', () => {
		let mongodb_uri = 'mongodb://0.0.0.0:27017/test';

		describe('when there is any errors happened', () => {
			it('should be rejected with an error', () => {
				const error_message = 'Connection issue';
				const stub = sinon.stub(MongoClient, 'connect').yields(new Error(error_message));
				const result = get_db(MongoClient, mongodb_uri);

				stub.restore();
				return expect(result).to.eventually.be.rejectedWith(Error, error_message);
			});
		});

		describe('For any success call', () => {
			it('should be resolved with the value returned', () => {
				const obj = {
					foo: 'bar'
				};
				const stub = sinon.stub(MongoClient, 'connect').yields(null, obj);
				const result = get_db(MongoClient, mongodb_uri);

				stub.restore();
				return expect(result).to.eventually.deep.equal(obj);
			});
		});
	});
});
