import crypto from 'crypto';

import { OperatorBetween } from './operator/OperatorBetween';
import { OperatorEqual } from './operator/OperatorEqual';
import { OperatorGreaterThanOrEqual } from './operator/OperatorGreaterThanOrEqual';
import { OperatorIn } from './operator/OperatorIn';
import { OperatorLessThan } from './operator/OperatorLessThan';
import { OperatorNotEqual } from './operator/OperatorNotEqual';
import { Condition } from './Condition';
import { OperatorType } from './OperatorType';
import {
	ConditionBetweenSchema,
	ConditionEqualSchema,
	ConditionGreaterThanOrEqualSchema,
	ConditionInSchema, ConditionLessThanSchema, ConditionNotEqualSchema, ConditionSerialised
} from './conditions-schema';

export class ConditionFactory {
	private static conditions = new Map<string, Condition>();

	static getSharedInstanceFromSerialized(conditionData: ConditionSerialised): Condition {
		// Calculate hash of input
		const hash = crypto.createHash('md5').update(JSON.stringify(conditionData)).digest('hex');

		// Check if already available
		let condition = ConditionFactory.conditions.get(hash);
		if (!condition) {
			// Otherwise create and store for future reuse
			condition = ConditionFactory.getFromSerialized(conditionData);
			ConditionFactory.conditions.set(hash, condition);
		}

		return condition;
	}

	static getFromSerialized(serialized: ConditionSerialised): Condition {
		// Create and return
		switch (serialized.operator) {
			case OperatorType.BETWEEN: {
				const parsed = ConditionBetweenSchema.parse(serialized);
				const condition = new OperatorBetween(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.EQUAL: {
				const parsed = ConditionEqualSchema.parse(serialized);
				const condition = new OperatorEqual(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.GREATER_THAN_OR_EQUAL: {
				const parsed = ConditionGreaterThanOrEqualSchema.parse(serialized);
				const condition = new OperatorGreaterThanOrEqual(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.IN: {
				const parsed = ConditionInSchema.parse(serialized);
				const condition = new OperatorIn(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.LESS_THAN: {
				const parsed = ConditionLessThanSchema.parse(serialized);
				const condition = new OperatorLessThan(parsed.path, parsed.value);
				return condition;
			}

			case OperatorType.NOT_EQUAL: {
				const parsed = ConditionNotEqualSchema.parse(serialized);
				const condition = new OperatorNotEqual(parsed.path, parsed.value);
				return condition;
			}

			default:
				throw new Error(`Unknown operator '${serialized.operator as string}' in ${JSON.stringify(serialized)}`);
		}
	}
}
