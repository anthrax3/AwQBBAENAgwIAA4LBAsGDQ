'use strict';

const Bluebird = require('bluebird');
const co = require('co');

// TODO support batch write?
// TODO [testing] stub 'collection'

/**
 * A Collection instance from Mongo DB Native NodeJS Driver
 * @typedef {object} Collection
 * @see {@link http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html}
 */

/**
 * An object contains the information from insert write operation
 * @typedef {object} insertWriteOpResult
 * @see {@link http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#~insertWriteOpResult}
 */

/**
 * Save exchange rate to MongoDB
 * @param {Collection} collection MongoDB collection
 * @param {object} data parsed output from parse_exchange_rate
 * @returns {Promise.<insertWriteOpResult>} result of insert write operation
 */
function insertExchangeRate(collection, data) {
	// TODO [testing] stub 'insert'
	const insertOne = Bluebird.promisify(collection.insertOne, {
		context: collection
	});

	// TODO [testing] spy the docs passed to 'insertOne'
	const docs = {
		from: data.from,
		to: data.to,
		created_at: new Date(data.timestamp * 1000),
		rate: data.rate
	};

	return co(function* () {
		return yield insertOne(docs);
	}).catch(err => Promise.reject(new Error(err.message)));
}

module.exports = insertExchangeRate;
