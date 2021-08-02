import { Duration } from 'luxon';

const durationMatcher = /(?<hours>\d{2,}):(?<minutes>\d{2}):(?<seconds>\d{2}).(?<deciseconds>\d{2})/;

export function stringToDuration(input: string): Duration {
	const match = durationMatcher.exec(input);
	return Duration.fromObject({
		hours: Number.parseInt(match?.groups.hours, 10),
		minutes: Number.parseInt(match?.groups.minutes, 10),
		seconds: Number.parseInt(match?.groups.seconds, 10),
		milliseconds: Number.parseInt(match?.groups.deciseconds, 10) * 10
	});
}

export function stringToDurationInMillis(input: string): number {
	return stringToDuration(input).toMillis();
}

export function getPercentageCompleted(positionInMillis: number, totalInMillis: number): number {
	const percentage = ((positionInMillis / totalInMillis) * 100).toFixed(2);
	return Number.parseFloat(percentage);
}
