import {
	getMetadataInputSample1,
	getMetadataInputSample2,
	getMetadataSample
} from '../../../../../test-assets/ffmpeg-example-outputs';
import { MetadataLineParser } from './MetadataLineParser';

describe('MetadataLineParser', () => {
	describe('passed sample consisting only of Metadata lines', () => {
		let metadataLineParser: MetadataLineParser;
		beforeEach(() => {
			metadataLineParser = new MetadataLineParser();
		});

		it('finds all ffpmeg lines', () => {
			for (const line of getMetadataSample()) {
				metadataLineParser.parse(line);
			}

			expect(metadataLineParser.lines.FFMPEG).toEqual([
				'ffmpeg version 4.4 Copyright (c) 2000-2021 the FFmpeg developers',
				'  built with Apple clang version 12.0.5 (clang-1205.0.22.9)',
				'  configuration: --prefix=/usr/local/Cellar/ffmpeg/4.4_2 --enable-shared --enable-pthreads --enable-version3 --cc=clang --host-cflags= --host-ldflags= --enable-ffplay --enable-gnutls --enable-gpl --enable-libaom --enable-libbluray --enable-libdav1d --enable-libmp3lame --enable-libopus --enable-librav1e --enable-librubberband --enable-libsnappy --enable-libsrt --enable-libtesseract --enable-libtheora --enable-libvidstab --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libxvid --enable-lzma --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libspeex --enable-libsoxr --enable-libzmq --enable-libzimg --disable-libjack --disable-indev=jack --enable-avresample --enable-videotoolbox',
				'  libavutil      56. 70.100 / 56. 70.100',
				'  libavcodec     58.134.100 / 58.134.100',
				'  libavformat    58. 76.100 / 58. 76.100',
				'  libavdevice    58. 13.100 / 58. 13.100',
				'  libavfilter     7.110.100 /  7.110.100',
				'  libavresample   4.  0.  0 /  4.  0.  0',
				'  libswscale      5.  9.100 /  5.  9.100',
				'  libswresample   3.  9.100 /  3.  9.100',
				'  libpostproc    55.  9.100 / 55.  9.100'
			]);
		});

		it('finds all input lines', () => {
			for (const line of getMetadataSample()) {
				metadataLineParser.parse(line);
			}

			expect(metadataLineParser.lines.INPUT).toEqual([
				"Input #0, mov,mp4,m4a,3gp,3g2,mj2, from './local-test-files/nrk/nrk.mp4':",
				'  Metadata:',
				'    major_brand     : isom',
				'    minor_version   : 512',
				'    compatible_brands: isomiso2avc1mp41',
				'    title           : 1331952933524119',
				'    encoder         : Lavf56.40.101',
				'  Duration: 00:02:54.31, start: 0.000000, bitrate: 791 kb/s',
				'  StreamLineParser #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p, 1280x720 [SAR 1:1 DAR 16:9], 739 kb/s, 25 fps, 25 tbr, 90k tbn, 50 tbc (default)',
				'    Metadata:',
				'      handler_name    : VideoHandler',
				'      vendor_id       : [0][0][0][0]',
				'  StreamLineParser #0:1(und): Audio: aac (HE-AACv2) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 47 kb/s (default)',
				'    Metadata:',
				'      handler_name    : SoundHandler',
				'      vendor_id       : [0][0][0][0]'
			]);
		});

		it('finds all output lines', () => {
			for (const line of getMetadataSample()) {
				metadataLineParser.parse(line);
			}

			expect(metadataLineParser.lines.OUTPUT).toEqual([
				"Output #0, null, to 'pipe:':",
				'  Metadata:',
				'    major_brand     : isom',
				'    minor_version   : 512',
				'    compatible_brands: isomiso2avc1mp41',
				'    title           : 1331952933524119',
				'    encoder         : Lavf58.76.100',
				'  StreamLineParser #0:0(und): Video: wrapped_avframe, yuv420p(progressive), 1280x720 [SAR 1:1 DAR 16:9], q=2-31, 200 kb/s, 25 fps, 25 tbn (default)',
				'    Metadata:',
				'      handler_name    : VideoHandler',
				'      vendor_id       : [0][0][0][0]',
				'      encoder         : Lavc58.134.100 wrapped_avframe',
				'  StreamLineParser #0:1(und): Audio: pcm_s16le, 48000 Hz, stereo, s16, 1536 kb/s (default)',
				'    Metadata:',
				'      handler_name    : SoundHandler',
				'      vendor_id       : [0][0][0][0]',
				'      encoder         : Lavc58.134.100 pcm_s16le'
			]);
		});

		it('finds all other lines', () => {
			for (const line of getMetadataSample()) {
				metadataLineParser.parse(line);
			}

			expect(metadataLineParser.lines.OTHER).toEqual([
				'StreamLineParser mapping:',
				'  StreamLineParser #0:0 -> #0:0 (h264 (native) -> wrapped_avframe (native))',
				'  StreamLineParser #0:1 -> #0:1 (aac (native) -> pcm_s16le (native))',
				'Press [q] to stop, [?] for help',
				'video:2277kB audio:32600kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: unknown'
			]);
		});

		it('finds the duration of the input', () => {
			for (const line of getMetadataSample()) {
				metadataLineParser.parse(line);
			}

			expect(metadataLineParser.getDurationMs()).toEqual(174_310);
		});
	});

	describe('#findDuration', () => {
		it('finds duration (1)', () => {
			const result = MetadataLineParser.findDuration(getMetadataInputSample1());
			expect(result).toEqual('00:02:54.31');
		});

		it('finds duration (2)', () => {
			const result = MetadataLineParser.findDuration(getMetadataInputSample2());
			expect(result).toEqual('00:29:00.08');
		});
	});
});
