'use strict';

const accounting = require('accounting');
const _ = require('lodash');

/**
 * @typedef {object} TransformedRateInfo
 * TODO
 *

/**
 * Parse the exchange rate from ExchangeRateRequest's resolved value
 *
 * See {@link ExchangeRateRequest}
 * @param {object} input exchange convert success payload
 * @returns {object} parsed output
 */
function parseExchangeRate(input, decimal_places) {
	let from = input.source;

	return {
		from: from,
		to: _extractQuotes(input.quotes, from),
		// to: 'HKD',
		timestamp: input.timestamp,
		rate: accounting.toFixed('7.76', 2)
	};
}

function _extractQuotes(quotes, from) {
	// assume there're only 1 entry under the key "quotes"
	let first_key = _.keys(quotes)[0];

	if (!first_key) {
		throw new Error('Invalid Date: expect `quotes` not empty');
	}

	return first_key.replace(new RegExp(from), '');
}

module.exports = parseExchangeRate;
