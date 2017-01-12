'use strict';

/**
 * Log the error and exit the process with exit code 1
 * @param {error} err
 */
function exitOnError(err) {
	console.error(err.messsage, err.stack);
	process.exit(1);
}

module.exports = exitOnError;
