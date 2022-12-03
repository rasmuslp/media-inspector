import { ErrorSummary } from './ffmpeg/output-parser/ErrorSummary';

export interface IVideoErrorDetector {
	start(demuxOnly: boolean): Promise<ErrorSummary>;
}
