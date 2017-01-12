'use strict';

const axios = require('axios');
const parse_exchange_rate = require('./parse_exchange_rate');

class ExchangeRateRequest {

	/**
	 * Create a new ExchangeRateRequest
	 * @param {object} options - options parameters
	 * @param {string} options.access_key - API key for the exchange rate API
	 * @param {string} [options.host = localhost] - host of the exchange rate API
	 * @param {number} [options.port = 80] - port number of the exchange rate API
	 * @constructor
	 */
	constructor(options) {
		if (!options) {
			throw new ReferenceError('`options` is required');
		}

		options = options || {};
		this._access_key = options.access_key;

		// TODO verify the default values below
		this._host = options.host || 'localhost';
		this._port = options.port || 80;
	}

	/**
	 * @typedef {object} ExchangeRateInfo
	 * @property {string} from
	 * @property {string} to
	 * @property {string} rate - 2 decimal places
	 * @property {string} timestamp - Unix timestamp in seconds 
	 */
	/**
	 * Query the currency rate
	 * @param {object} query_info
	 * @returns {Promise.<ExchangeRateInfo>} A promise to the currency info
	 */
	query(query_info) {
		if (!query_info || !query_info.from || !query_info.to) {
			return Promise.reject(new Error('Invalid parameters'));
		}

		// TODO consider make the path configurable
		let request_uri = this._host + '/api/live';
		return axios.get(request_uri, {
			params: {
				access_key: this._access_key,
				source: query_info.from,
				currencies: query_info.to
			}
		})
			.then(response => {
				const data = response.data;

				if (data.success) {
					return Promise.resolve(parse_exchange_rate(response.data));
				} else {
					throw new Error(data.error.info);
				}
			})
			.catch(err => {
				return Promise.reject(err);
			});
	}
}

module.exports = ExchangeRateRequest;
