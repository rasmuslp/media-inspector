import crypto from 'crypto';

import { ConditionOperator } from './ConditionOperator';

import { Condition, ConditionSerialised } from './Condition';
import { ConditionBetween, ConditionBetweenSchema } from './operators/ConditionBetween';
import { ConditionEqual, ConditionEqualSchema } from './operators/ConditionEqual';
import { ConditionGreaterThanOrEqual, ConditionGreaterThanOrEqualSchema } from './operators/ConditionGreaterThanOrEqual';
import { ConditionIn, ConditionInSchema } from './operators/ConditionIn';
import { ConditionLessThan, ConditionLessThanSchema } from './operators/ConditionLessThan';
import { ConditionNotEqual, ConditionNotEqualSchema } from './operators/ConditionNotEqual';

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
			case ConditionOperator.BETWEEN: {
				const parsed = ConditionBetweenSchema.parse(serialized);
				const condition = new ConditionBetween(parsed.path, parsed.value);
				return condition;
			}

			case ConditionOperator.EQUAL: {
				const parsed = ConditionEqualSchema.parse(serialized);
				const condition = new ConditionEqual(parsed.path, parsed.value);
				return condition;
			}

			case ConditionOperator.GREATER_THAN_OR_EQUAL: {
				const parsed = ConditionGreaterThanOrEqualSchema.parse(serialized);
				const condition = new ConditionGreaterThanOrEqual(parsed.path, parsed.value);
				return condition;
			}

			case ConditionOperator.IN: {
				const parsed = ConditionInSchema.parse(serialized);
				const condition = new ConditionIn(parsed.path, parsed.value);
				return condition;
			}

			case ConditionOperator.LESS_THAN: {
				const parsed = ConditionLessThanSchema.parse(serialized);
				const condition = new ConditionLessThan(parsed.path, parsed.value);
				return condition;
			}

			case ConditionOperator.NOT_EQUAL: {
				const parsed = ConditionNotEqualSchema.parse(serialized);
				const condition = new ConditionNotEqual(parsed.path, parsed.value);
				return condition;
			}

			default:
				throw new Error(`Unknown operator '${serialized.operator as string}' in ${JSON.stringify(serialized)}`);
		}
	}
}
