import createDebug from 'debug';

import { ConditionChecker } from '../condition/ConditionChecker';
import { IConditionResult } from '../condition/IConditionResult';
import { IVideoRule } from './IVideoRule';
import { RuleResult } from './RuleResult';

const debug = createDebug('Rule');

export class RuleChecker {
	static checkRuleWithPathGetter(rule: IVideoRule, pathGetterFn: (path: string) => number | string): RuleResult | undefined {
		// All conditions must be met
		const conditionResults: IConditionResult[] = [];
		for (const condition of rule.conditions) {
			// Try to read value
			let value: number | string;
			try {
				value = pathGetterFn(condition.path);
			}
			catch (error) {
				// TODO: Log better with verbose, perhaps have a strict mode of some kind?
				// I assume, that currently 'audio.channels < 2' wont fail, if there is no 'channels' (although it probably will fail if there isn't an audio track)
				debug(`Could not read ${condition.path} from ${condition.path}`, (error as Error).message || error);
				continue;
			}

			// Check and store
			const conditionResult = ConditionChecker.getResultFor(condition, value);
			conditionResults.push(conditionResult);
		}

		if (conditionResults.length > 0) {
			return new RuleResult(conditionResults);
		}

		return undefined;
	}
}
