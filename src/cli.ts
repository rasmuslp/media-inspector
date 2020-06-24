#!/usr/bin/env node

import yargs from 'yargs';

import * as lib from './lib';

const argv = yargs
	.wrap(yargs.terminalWidth() || 0)
	.env()
	.options('read', {
		alias: ['r', 'readPath'],
		demandOption: true,
		describe: 'Path or pre-read JSON file to read',
		requiresArg: true,
		type: 'string'
	})
	.options('write', {
		alias: ['w', 'writePath'],
		describe: 'Path to write results of read',
		implies: ['read'],
		requiresArg: true,
		type: 'string'
	})
	.options('filter', {
		alias: ['f', 'filterPath'],
		describe: 'Filter configuration file in JSON or JSON5',
		implies: ['read'],
		requiresArg: true,
		type: 'string'
	})
	.options('include-auxiliary', {
		alias: ['i', 'includeAuxiliary'],
		default: false,
		describe: 'Will also include empty directories and \'container\' directories',
		type: 'boolean'
	})
	.option('verbose', {
		alias: ['v'],
		default: false,
		describe: 'Get more details of the operation and state',
		type: 'boolean'
	})
	.argv;

async function run(): Promise<void> {
	try {
		await lib.run({
			readPath: argv.readPath as string,
			writePath: argv.writePath as string,
			filterPath: argv.filterPath as string,
			includeAuxiliary: argv.includeAuxiliary as boolean,
			verbose: argv.verbose
		});
	}
	catch (e) {
		console.log('Error occured!', e);
	}
}

void run();
