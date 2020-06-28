import crypto from 'crypto';

import { ConditionOperator } from './ConditionOperator';

import { Condition, ConditionData } from './Condition';
import { ConditionBetween } from './operators/ConditionBetween';
import { ConditionEqual } from './operators/ConditionEqual';
import { ConditionGreaterThanOrEqual } from './operators/ConditionGreaterThanOrEqual';
import { ConditionIn } from './operators/ConditionIn';
import { ConditionLessThan } from './operators/ConditionLessThan';
import { ConditionNotEqual } from './operators/ConditionNotEqual';

export class ConditionFactory {
	static _conditions = new Map();

	static getSharedInstanceFromSerialized(conditionData: ConditionData): Condition {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(conditionData)).digest('hex');

		// Check if already available
		if (ConditionFactory._conditions.has(hash)) {
			return ConditionFactory._conditions.get(hash);
		}

		// Otherwise create and store for future reuse
		const condition = ConditionFactory.getFromSerialized(conditionData);
		ConditionFactory._conditions.set(hash, condition);

		return condition;
	}

	static getFromSerialized(inputCondition: ConditionData): Condition {
		const condition = Object.assign({}, inputCondition);

		// Create and return
		switch (condition.operator) {
			case ConditionOperator.BETWEEN:
				return new ConditionBetween(condition.path, condition.value);

			case ConditionOperator.IN:
				return new ConditionIn(condition.path, condition.value);

			case ConditionOperator.EQUAL:
				return new ConditionEqual(condition.path, condition.value);

			case ConditionOperator.NOT_EQUAL:
				return new ConditionNotEqual(condition.path, condition.value);

			case ConditionOperator.LESS_THAN:
				return new ConditionLessThan(condition.path, condition.value);

			case ConditionOperator.GREATER_THAN_OR_EQUAL:
				return new ConditionGreaterThanOrEqual(condition.path, condition.value);

			default:
				throw new Error(`Unknown operator '${condition.operator}' in ${JSON.stringify(inputCondition)}`);
		}
	}
}
