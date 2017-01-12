'use strict';

const debug = require('debug')('seed');

const Bluebird = require('bluebird');
const co = require('co');
const fivebeans = require('fivebeans');

// TODO alternate ways like read from STDIN or environment
const app = require('../config/app.json');
const exit_on_error = require('./util/exit_on_error');

const client = new fivebeans.client(app.beanstalkd.host, app.beanstalkd.port);
const use = Bluebird.promisify(client.use, {
	context: client
});
const put = Bluebird.promisify(client.put, {
	context: client
});

client
	.on('connect', () => {
		debug('Connected');

		co(function* () {
			console.info('Use tube: %s', yield use(app.tube_name));

			// TODO
			// 1. read the payload form STDOUT
			// 2. figure out a sensitive default for 'ttr' (the 3rd argument)
			console.info('Job id', yield put(0, 0, 10, JSON.stringify(app.seed)), ': done');
			process.exit();
		}).catch(exit_on_error);
	})
	.on('error', exit_on_error)
	.connect();
