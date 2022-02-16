import { mock, MockProxy } from 'jest-mock-extended';

import { File } from '../fs-tree';
import { IMetadataGetter } from '../metadata/IMetadataGetter';
import { Metadata } from '../metadata/Metadata';
import { Equal } from '../standard/condition/types/Equal';
import { GreaterThanOrEqual } from '../standard/condition/types/GreaterThanOrEqual';
import { ICondition } from '../standard';
import { IConditionsAnalyzer } from './condition/IConditionsAnalyzer';
import { IConditionResult } from './condition/IConditionResult';
import { IVideoFileRuleMatcher } from './IVideoFileRuleMatcher';
import { VideoFileRuleMatcher } from './VideoFileRuleMatcher';

describe('VideoFileRuleMatcher', () => {
	describe('fileMatches - Fake DVR recording', () => {
		let file: File;
		let metadataGetter: MockProxy<IMetadataGetter>;
		let conditionsAnalyzer: MockProxy<IConditionsAnalyzer>;
		let videoFileRuleMatcher: IVideoFileRuleMatcher;
		beforeEach(() => {
			file = new File('/home/user/Movies/recording.ts', {
				size: 4_816_653_812
			}, 'video/mp2t');
			metadataGetter = mock<IMetadataGetter>();
			conditionsAnalyzer = mock<IConditionsAnalyzer>();
			videoFileRuleMatcher = new VideoFileRuleMatcher(metadataGetter, conditionsAnalyzer);
		});

		it('should match on fileExtension .ts', () => {
			const match = videoFileRuleMatcher.match(file, {
				fileExtension: '.ts'
			});
			expect(match).toBe(true);
		});

		it('should not match on fileExtension .mp4', () => {
			const match = videoFileRuleMatcher.match(file, {
				fileExtension: '.mp4'
			});
			expect(match).toBe(false);
		});

		it('should match on mimeType video/mp2t', () => {
			const match = videoFileRuleMatcher.match(file, {
				mimeType: 'video/mp2t'
			});
			expect(match).toBe(true);
		});

		it('should not match on mimeType video/x-matroska', () => {
			const match = videoFileRuleMatcher.match(file, {
				mimeType: 'video/x-matroska'
			});
			expect(match).toBe(false);
		});

		it('should match on fileExtension .ts and mimeType video/mp2t', () => {
			const match = videoFileRuleMatcher.match(file, {
				fileExtension: '.ts',
				mimeType: 'video/mp2t'
			});
			expect(match).toBe(true);
		});

		it('should not match on fileExtension .ts and mimeType video/x-matroska', () => {
			const match = videoFileRuleMatcher.match(file, {
				fileExtension: '.ts',
				mimeType: 'video/x-matroska'
			});
			expect(match).toBe(false);
		});

		describe('with metadata', () => {
			let metadata: MockProxy<Metadata>;
			let videoRuleMatchMetadata: ICondition[];
			beforeEach(() => {
				metadata = mock<Metadata>();
				metadataGetter.getMetadata
					.calledWith(file.path)
					.mockReturnValueOnce(metadata);
				videoRuleMatchMetadata = [
					new Equal('video.format', 'avc'),
					new GreaterThanOrEqual('general.bitrate', 1_200_000)
				];
			});

			it('should match on metadata - 2 conditions satisfied', () => {
				conditionsAnalyzer.analyze
					.calledWith(videoRuleMatchMetadata, metadata)
					.mockReturnValueOnce([{
						isSatisfied: true
					} as IConditionResult, {
						isSatisfied: true
					} as IConditionResult]);

				const match = videoFileRuleMatcher.match(file, {
					metadata: videoRuleMatchMetadata
				});

				expect(match).toBe(true);
			});

			it('should not match on metadata - 1 condition satisfied, 1 condition not satisfied', () => {
				conditionsAnalyzer.analyze
					.calledWith(videoRuleMatchMetadata, metadata)
					.mockReturnValueOnce([{
						isSatisfied: true
					} as IConditionResult, {
						isSatisfied: false
					} as IConditionResult]);

				const match = videoFileRuleMatcher.match(file, {
					metadata: videoRuleMatchMetadata
				});

				expect(match).toBe(false);
			});

			it('should match on fileExtension .ts and metadata - 2 condition satisfied', () => {
				conditionsAnalyzer.analyze
					.calledWith(videoRuleMatchMetadata, metadata)
					.mockReturnValueOnce([{
						isSatisfied: true
					} as IConditionResult, {
						isSatisfied: true
					} as IConditionResult]);

				const match = videoFileRuleMatcher.match(file, {
					fileExtension: '.ts',
					metadata: videoRuleMatchMetadata
				});

				expect(match).toBe(true);
			});
		});
	});
});
