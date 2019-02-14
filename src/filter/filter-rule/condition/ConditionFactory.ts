import crypto from 'crypto';

import { ConditionBetween } from './ConditionBetween';
import { ConditionEq } from './ConditionEq';
import { ConditionGe } from './ConditionGe';
import { ConditionIn } from './ConditionIn';
import { ConditionLt } from './ConditionLt';
import { ConditionNe } from './ConditionNe';

export interface ConditionData {
	path: string;
	operator: string; // TODO: enum
	value;
}

export class ConditionFactory {
	static _conditions = new Map();

	static createCondition(inputCondition: ConditionData) {
		const condition = Object.assign({}, inputCondition);

		// Create and return
		switch (condition.operator) {
			case 'between':
				return new ConditionBetween(condition.path, condition.value);

			case 'in':
				return new ConditionIn(condition.path, condition.value);

			case '=':
				return new ConditionEq(condition.path, condition.value);

			case '!=':
				return new ConditionNe(condition.path, condition.value);

			case '<':
				return new ConditionLt(condition.path, condition.value);

			case '>=':
				return new ConditionGe(condition.path, condition.value);

			default:
				throw new Error(`Unknown operator '${condition.operator}' in ${JSON.stringify(inputCondition)}`);
		}
	}

	static getCondition(conditionData: ConditionData) {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(conditionData)).digest('hex');

		// Check if already available
		if (ConditionFactory._conditions.has(hash)) {
			return ConditionFactory._conditions.get(hash);
		}

		// Otherwise create and store for future reuse
		const condition = ConditionFactory.createCondition(conditionData);
		ConditionFactory._conditions.set(hash, condition);

		return condition;
	}
}
