import createDebug from 'debug';

import { Metadata } from '../../metadata/Metadata';
import { ICondition } from '../../standard';
import { IConditionResult } from '../interfaces/IConditionResult';
import { IConditionAnalyzer } from '../interfaces/IConditionAnalyzer';
import { IConditionsAnalyzer } from '../interfaces/IConditionsAnalyzer';

const debug = createDebug('ConditionsAnalyzer');

export class ConditionsAnalyzer implements IConditionsAnalyzer {
	private readonly conditionAnalyzer: IConditionAnalyzer;

	constructor(conditionAnalyzer: IConditionAnalyzer) {
		this.conditionAnalyzer = conditionAnalyzer;
	}

	public analyze(conditions: ICondition[], metadata: Metadata): IConditionResult[] {
		// All conditions must be met
		const conditionResults: IConditionResult[] = [];
		for (const condition of conditions) {
			// Try to read value
			let value: number | string;
			try {
				value = metadata.get(condition.path);
			}
			catch (error) {
				// TODO: Log better with verbose, perhaps have a strict mode of some kind?
				// I assume, that currently 'audio.channels < 2' wont fail, if there is no 'channels' (although it probably will fail if there isn't an audio track)
				debug(`Could not read ${condition.path} from ${condition.path}`, (error as Error).message || error);
				continue;
			}

			// Check and store
			const conditionResult = this.conditionAnalyzer.analyze(condition, value);
			conditionResults.push(conditionResult);
		}

		return conditionResults;
	}
}
