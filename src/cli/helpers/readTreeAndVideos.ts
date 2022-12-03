import { CliUx } from '@oclif/core';
import createDebug from 'debug';

import { File, FsTree, FsTreeFactory } from '../../fs-tree';

const debug = createDebug('readTreeAndVideos');

export async function readTreeAndVideos(path: string, verbose: boolean): Promise<{ fsTree: FsTree; videoFiles: File[] }> {
	debug('Reading %s', path);
	if (verbose) {
		CliUx.ux.action.start(`Reading from file system ${path}`);
	}
	const fsTree = await FsTreeFactory.getTreeFromFileSystem(path);
	const nodes = await fsTree.getAsSortedList();
	if (verbose) {
		CliUx.ux.action.stop();
		CliUx.ux.log(`Found ${nodes.length} files and directories`);
	}
	debug('Found %d nodes', nodes.length);
	const files: File[] = nodes.filter(node => node instanceof File).map(node => node as File);
	const videoFiles = files.filter(file => file.mimeType.startsWith('video/'));
	debug('Found %d video files', videoFiles.length);

	return { fsTree, videoFiles };
}
