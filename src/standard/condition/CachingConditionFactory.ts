import crypto from 'crypto';

import { ICondition } from './ICondition';
import { IConditionFactory } from './IConditionFactory';
import { ConditionSerialised } from './ConditionSchema';

export class CachingConditionFactory implements IConditionFactory {
	private readonly conditions = new Map<string, ICondition>();

	private readonly conditionFactory: IConditionFactory;

	constructor(conditionFactory: IConditionFactory) {
		this.conditionFactory = conditionFactory;
	}

	public create(conditionData: ConditionSerialised): ICondition {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(conditionData)).digest('hex');

		// Check if already available
		let condition = this.conditions.get(hash);
		if (!condition) {
			condition = this.conditionFactory.create(conditionData);
			this.conditions.set(hash, condition);
		}

		return condition;
	}
}
