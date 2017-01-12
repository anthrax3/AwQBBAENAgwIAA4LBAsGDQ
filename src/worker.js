'use strict';

const co = require('co');
const debug = require('debug')('worker');
const Bluebird = require('bluebird');
const fivebeans = require('fivebeans');

const app = require('../config/app.json');
const exit_on_error = require('./util/exit_on_error');

const client = new fivebeans.client(app.beanstalkd.host, app.beanstalkd.port);
// 'promisify' fivebean methods
const bury = Bluebird.promisify(client.bury, {
	context: client
});
const release = Bluebird.promisify(client.release, {
	context: client
});
const watch = Bluebird.promisify(client.watch, {
	context: client
});
const reserve = Bluebird.promisify(client.reserve, {
	context: client,
	multiArgs: true
});

const MongoClient = require('mongodb').MongoClient;
const get_db = require('./mongo_db/get_db');
const insert_exchange_rate = require('./mongo_db/insert_exchange_rate');

const ExchangeRateRequest = require('./api/exchange_rate_request');
const exchange_rate_request = new ExchangeRateRequest({
	host: app.exchange_rate_api.host,
	access_key: app.exchange_rate_api.access_key
});

let job_id;
let no_of_success = 0;
let no_of_failure = 0;

client.on('connect', function () {
	debug('connected');

	function keepRunning() {
		return (no_of_success < app.attempt.succeed) &&
			(no_of_failure < app.attempt.failed);
	}

	function isLastFailureAttempt() {
		return no_of_failure === (app.attempt.failed);
	}

	co(function* () {
		while (keepRunning()) {
			yield co(function* () {
				try {
					debug('watch %d tube(s)', yield watch(app.tube_name));

					// 'reserve' command is blocking?
					const result = yield reserve();
					debug('result', result);

					job_id = result[0];
					const payload = result[1];
					const query_info = JSON.parse(payload.toString());

					// const exchange_rate_info = yield exchange_rate_request.query(query_info);
					const exchange_rate_info = yield Promise.reject(new Error('fake'));
					debug('exchange_rate_info', exchange_rate_info);

					no_of_success++;
					debug('release job id %d after success', job_id);
					yield release(job_id, 0, app.delay.succeed);

					// return exchange_rate_info;
					const db = yield get_db(new MongoClient(), app.mongodb.uri);

					// no safe mode or {strict: true}
					const collection = db.collection(app.mongodb.collection_name);

					debug('result: %o', yield insert_exchange_rate(collection, exchange_rate_info));
				} catch (e) {
					no_of_failure++;

					if (isLastFailureAttempt()) {
						debug('Bury job id %d', job_id);
						yield bury(job_id, 0);
					} else {
						debug('release job id %d after failed', job_id);
						yield release(job_id, 0, app.delay.failed);
					}
				}
			}).catch(console.error);
		}

		console.info('Done');
	}).then(() => process.exit())
		.catch(exit_on_error);
}).connect();
