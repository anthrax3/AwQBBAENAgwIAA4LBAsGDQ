'use strict';

const Bluebird = require('bluebird');
const co = require('co');
const _ = require('lodash');

/**
 * A Db instance from Mongo DB Native NodeJS Driver
 * @typedef {object} Db
 * @see {@link http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html}
 */

/**
 * Get the database instance
 * @param {MongoClient} client - The MongoClient class or instance
 * @param {string} mongodb_uri - MongoDB connection uri
 * @returns {Promise.<Db>} database instance
 */
// TODO replace 'mongo_uri' with host, port, and database name separately with defaults
function getDb(client, mongodb_uri) {
	// maybe too loose
	if (!client || !_.isFunction(client.connect)) {
		return Promise.reject(new TypeError('MongoClient or its instance is expected'));
	}
	if (!mongodb_uri) {
		return Promise.reject(new Error('Invalid MongoDB URI'));
	}

	const connect = Bluebird.promisify(client.connect, {
		context: client
	});

	return co(function* () {
		return yield connect(mongodb_uri);
	}).catch(err => Promise.reject(new Error(err.message)));
}

module.exports = getDb;
