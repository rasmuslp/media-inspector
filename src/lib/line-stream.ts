import split2 from 'split2';
import { Transform } from 'stream';

export function lineStream(): Transform {
	return split2(/\r\n|\n|\r/);
}
