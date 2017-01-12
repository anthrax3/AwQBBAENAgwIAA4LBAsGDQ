'use strict';

const expect = require('chai').expect;

const parse_exchange_rate = require('../../src/api/parse_exchange_rate');
const fixture = require('../fixture/currencylayer.com');

describe('parse exchange rate', () => {
	let src = fixture.raw_success;
	let expected = fixture.transformed;

	it('should parse currencylayer API response correctly', () => {
		let actual = parse_exchange_rate(src, 2);
		expect(actual).to.deep.equal(expected);
	});

	it.skip('should throw error for invalid iput', () => {
	});
});
