import { mock, MockProxy } from 'jest-mock-extended';

import { IVideoStandardFactory } from './video-standard/IVideoStandardFactory';
import { VideoStandardDefinition } from './video-standard/VideoStandardSchema';
import { VideoStandard } from './video-standard/VideoStandard';
import { IStandardFactory } from './IStandardFactory';
import { StandardFactory } from './StandardFactory';
import { Standard } from './Standard';

describe('StandardFactory', () => {
	let mockVideoStandardFactory: MockProxy<IVideoStandardFactory>;
	let standardFactory: IStandardFactory;
	beforeEach(() => {
		mockVideoStandardFactory = mock<IVideoStandardFactory>();
		standardFactory = new StandardFactory(mockVideoStandardFactory);
	});

	describe('.create', () => {
		it('should return a new Standard', () => {
			mockVideoStandardFactory.create
				.calledWith('videoSchema' as VideoStandardDefinition)
				.mockReturnValueOnce('VideoStandard' as unknown as VideoStandard); // TODO: Interface
			const result = standardFactory.create({
				video: 'videoSchema' as VideoStandardDefinition
			});
			expect(result).toBeInstanceOf(Standard);
			expect(result.videoStandard).toBe('VideoStandard');
		});
	});
});
