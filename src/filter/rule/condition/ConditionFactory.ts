import crypto from 'crypto';

import { ConditionOperator } from './ConditionOperator';

import { Condition, ConditionData } from './Condition';
import { ConditionBetween, ConditionBetweenData } from './operators/ConditionBetween';
import { ConditionEqual, ConditionEqualData } from './operators/ConditionEqual';
import { ConditionGreaterThanOrEqual, ConditionGreaterThanOrEqualData } from './operators/ConditionGreaterThanOrEqual';
import { ConditionIn, ConditionInData } from './operators/ConditionIn';
import { ConditionLessThan, ConditionLessThanData } from './operators/ConditionLessThan';
import { ConditionNotEqual, ConditionNotEqualData } from './operators/ConditionNotEqual';

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

	static getFromSerialized(condition: ConditionData): Condition {
		// Create and return
		switch (condition.operator) {
			case ConditionOperator.BETWEEN: {
				const data = Object.assign({}, condition) as ConditionBetweenData;
				return new ConditionBetween(data.path, data.value);
			}

			case ConditionOperator.EQUAL: {
				const data = Object.assign({}, condition) as ConditionEqualData;
				return new ConditionEqual(data.path, data.value);
			}

			case ConditionOperator.GREATER_THAN_OR_EQUAL: {
				const data = Object.assign({}, condition) as ConditionGreaterThanOrEqualData;
				return new ConditionGreaterThanOrEqual(data.path, data.value);
			}

			case ConditionOperator.IN: {
				const data = Object.assign({}, condition) as ConditionInData;
				return new ConditionIn(data.path, data.value);
			}

			case ConditionOperator.LESS_THAN: {
				const data = Object.assign({}, condition) as ConditionLessThanData;
				return new ConditionLessThan(data.path, data.value);
			}

			case ConditionOperator.NOT_EQUAL: {
				const data = Object.assign({}, condition) as ConditionNotEqualData;
				return new ConditionNotEqual(data.path, data.value);
			}

			default:
				throw new Error(`Unknown operator '${condition.operator}' in ${JSON.stringify(condition)}`);
		}
	}
}
