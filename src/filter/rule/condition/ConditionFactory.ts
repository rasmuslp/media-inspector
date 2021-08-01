import crypto from 'crypto';

import { OperatorBetween, OperatorBetweenSchema } from './operator/OperatorBetween';
import { OperatorEqual, OperatorEqualSchema } from './operator/OperatorEqual';
import { OperatorGreaterThanOrEqual, OperatorGreaterThanOrEqualSchema } from './operator/OperatorGreaterThanOrEqual';
import { OperatorIn, OperatorInSchema } from './operator/OperatorIn';
import { OperatorLessThan, OperatorLessThanSchema } from './operator/OperatorLessThan';
import { OperatorNotEqual, OperatorNotEqualSchema } from './operator/OperatorNotEqual';
import { Condition, ConditionSerialised } from './Condition';
import { OperatorType } from './OperatorType';

export class ConditionFactory {
	static _conditions = new Map<string, Condition>();

	static getSharedInstanceFromSerialized(conditionData: ConditionSerialised): Condition {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(conditionData)).digest('hex');

		// Check if already available
		let condition = ConditionFactory._conditions.get(hash);
		if (!condition) {
			// Otherwise create and store for future reuse
			condition = ConditionFactory.getFromSerialized(conditionData);
			ConditionFactory._conditions.set(hash, condition);
		}

		return condition;
	}

	static getFromSerialized(serialized: ConditionSerialised): Condition {
		// Create and return
		switch (serialized.operator) {
			case OperatorType.BETWEEN: {
				const parsed = OperatorBetweenSchema.parse(serialized);
				const condition = new OperatorBetween(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.EQUAL: {
				const parsed = OperatorEqualSchema.parse(serialized);
				const condition = new OperatorEqual(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.GREATER_THAN_OR_EQUAL: {
				const parsed = OperatorGreaterThanOrEqualSchema.parse(serialized);
				const condition = new OperatorGreaterThanOrEqual(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.IN: {
				const parsed = OperatorInSchema.parse(serialized);
				const condition = new OperatorIn(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.LESS_THAN: {
				const parsed = OperatorLessThanSchema.parse(serialized);
				const condition = new OperatorLessThan(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.NOT_EQUAL: {
				const parsed = OperatorNotEqualSchema.parse(serialized);
				const condition = new OperatorNotEqual(parsed.path, parsed.value);
				return condition;
			}

			default:
				throw new Error(`Unknown operator '${serialized.operator as string}' in ${JSON.stringify(serialized)}`);
		}
	}
}
