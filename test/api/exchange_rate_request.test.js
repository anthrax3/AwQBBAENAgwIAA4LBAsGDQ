'use strict';

const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');

const chai_as_promised = require('chai-as-promised');
chai.use(chai_as_promised);

const ExchangeRateRequest = require('../../src/api/exchange_rate_request');
const fixture = require('../fixture/currencylayer.com');

describe('Exchange rate request', function () {
	let api_host = 'http://www.apilayer.net';
	let access_key = '50934592d125572407ad61d9421b4b26';

	let fakeConfig = {
		host: api_host,
		access_key: access_key
	};

	it('should throw Error when no config is passed', function () {
		expect(() => {
			new ExchangeRateRequest();
		}).to.throw(ReferenceError);

		let exchange_rate_request;
		expect(() => {
			exchange_rate_request = new ExchangeRateRequest(fakeConfig);
		}).to.not.throw(ReferenceError);

		expect(exchange_rate_request).to.be.instanceof(ExchangeRateRequest);
	});

	describe('#query()', function () {
		let exchange_rate_request;

		beforeEach(() => {
			exchange_rate_request = new ExchangeRateRequest(fakeConfig);
		});

		afterEach(() => {
			exchange_rate_request = null;
		});

		it('should be defined', function () {
			expect(exchange_rate_request).to.respondTo('query');
		});

		describe('when no parameters are passed', function () {
			it('should return a rejected promise', function () {
				let query_result = exchange_rate_request.query();
				return expect(query_result).to.eventually.be.rejected;
			});
		});

		describe('when invalid parameters are passed', () => {
			it('should return a reject promise', () => {
				let query_result = exchange_rate_request.query();
				return expect(query_result).to.eventually.be.rejectedWith(Error);
			});
		});

    describe.skip('when either "form" or "to" is not in ISO 4217 format', () => {
    });

		describe('when valid parameters are passed', function () {
			let query_info = {
				to: 'HKD',
				from: 'USD'
			};

			describe('and request is succeeded', function () {
				it('should return a resolved promise', function () {
					nock(api_host)
						.get('/api/live')
						.query({
							source: 'USD',
							currencies: 'HKD',
              access_key: access_key
						})
						.reply(200, fixture.raw_success);

					let query_result = exchange_rate_request.query(query_info);
					return expect(query_result).to.eventually.become(fixture.transformed);
				});
			});

			describe.skip('and request is failed', function () {});
			// TODO also test invalid uri
		});
	});
});
