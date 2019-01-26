#!/usr/bin/env node

import yargs from 'yargs';

import * as lib from'./lib';

// TODO: Ideas for other options:
// --ignore-ext [ext]
// --ignore-mime [mimetype]

function getSharedBuilder(yargs) {
	return yargs
		.options('filter', {
			alias: ['f', 'filterPath'],
			demandOption: true,
			describe: 'Filter configuration file in JSON or JavaScript',
			type: 'string'

		})
		.options('include-recommended', {
			alias: ['i', 'includeRecommended'],
			default: false,
			describe: `Will also include empty directories and 'container' directories`,
			type: 'boolean'
		});
}

// eslint-disable-next-line no-unused-vars
const argv = yargs
	.wrap(yargs.terminalWidth() || 0)
	.env()
	.command(['scan <directory>', 's'], 'Outputs status and full result', {
		builder: yargs => {
			return getSharedBuilder(yargs);
		},
		handler: argv => {
			return lib.scan({
				directoryPath: argv.directory,
				filterPath: argv.filterPath,
				includeRecommended: argv.includeRecommended
			});
		}
	})
	.command(['list <directory>', 'ls'], 'Outputs paths. (useful for piping the output)', { // At least, that's the goal
		builder: yargs => {
			return getSharedBuilder(yargs);
		},
		handler: argv => {
			return lib.list({
				directoryPath: argv.directory,
				filterPath: argv.filterPath,
				includeRecommended: argv.includeRecommended
			});
		}
	})
	.command(['remove <directory>', 'rm'], 'Deletes files and directories not satisfying the filter configuration', {
		builder: yargs => {
			return getSharedBuilder(yargs)
				.option('dry-run', {
					alias: ['n', 'dryRun'],
					default: true,
					describe: 'Do not write changes',
					type: 'boolean'

				})
				.option('skip-log', {
					alias: 'skipLog',
					default: false,
					describe: `Don't write history in current working directory`,
					type: 'boolean'
				});
		},
		handler: argv => {
			return lib.remove({
				directoryPath: argv.directory,
				filterPath: argv.filterPath,
				includeRecommended: argv.includeRecommended,
				dryRun: argv.dryRun,
				skipLog: argv.skipLog
			});
		}
	})
	.demandCommand()
	.argv;
