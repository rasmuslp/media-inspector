import cli from 'cli-ux';
import { SingleBar } from 'cli-progress';
import createDebug from 'debug';
import pLimit from 'p-limit';

import { File, FsTreeFactory } from '../../fs-tree';
import { MetadataCache } from '../../metadata/MetadataCache';
import { MediainfoMetadata } from '../../metadata/mediainfo/MediainfoMetadata';
import { MediainfoMetadataFactory } from '../../metadata/mediainfo/MediainfoMetadataFactory';

const debug = createDebug('readMetadataFromFileSystem');

export async function readMetadataFromFileSystem(path: string, verbose: boolean): Promise<MetadataCache> {
	debug('Scanning filesystem path %s', path);
	if (verbose) {
		cli.action.start(`Reading from file system ${path}`);
	}
	const fsTree = await FsTreeFactory.getTreeFromFileSystem(path);
	const nodes = await fsTree.getAsSortedList();
	debug('Found %d nodes', nodes.length);
	if (verbose) {
		cli.action.stop();
		cli.log(`Found ${nodes.length} files and directories`);
	}

	const files: File[] = nodes.filter(node => node instanceof File).map(node => node as File);
	const videoFiles = files.filter(file => file.mimeType.startsWith('video/'));
	debug('Found %d video files', videoFiles.length);

	let metadataProgressBar: SingleBar|undefined;
	if (verbose) {
		metadataProgressBar = cli.progress({
			format: 'Reading metadata | {bar} | {value}/{total} video files',
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591'
		}) as SingleBar;
		metadataProgressBar.start(videoFiles.length, 0);
	}

	const videoMetadata = new Map<string, MediainfoMetadata>();
	const limiter = pLimit(10);
	const promises = videoFiles.map(videoFile => limiter(async () => {
		try {
			const metadata = await MediainfoMetadataFactory.getFromFileSystem(videoFile.path);
			videoMetadata.set(videoFile.path, metadata);
		}
		catch {
			// debug('sss Failed to read metadata from %s %s', videoFile.path, e.toString());
		}
		if (verbose && metadataProgressBar) {
			metadataProgressBar.increment();
		}
	}));
	debug('Reading metadata from %d files', videoFiles.length);
	await Promise.all(promises);
	if (verbose && metadataProgressBar) {
		metadataProgressBar.stop();
	}

	const metadataCache = new MetadataCache(fsTree, videoMetadata);

	debug('done');
	return metadataCache;
}
