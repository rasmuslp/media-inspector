import crypto from 'crypto';

import { Between } from './types/Between';
import { Equal } from './types/Equal';
import { GreaterThanOrEqual } from './types/GreaterThanOrEqual';
import { In } from './types/In';
import { LessThan } from './types/LessThan';
import { NotEqual } from './types/NotEqual';
import { ICondition } from './ICondition';
import { Operator } from './Operator';
import {
	ConditionBetweenSchema,
	ConditionEqualSchema,
	ConditionGreaterThanOrEqualSchema,
	ConditionInSchema, ConditionLessThanSchema, ConditionNotEqualSchema, ConditionSerialised
} from './conditions-schema';

export class ConditionFactory {
	private static conditions = new Map<string, ICondition>();

	static getSharedInstanceFromSerialized(conditionData: ConditionSerialised): ICondition {
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

	static getFromSerialized(serialized: ConditionSerialised): ICondition {
		// Create and return
		switch (serialized.operator) {
			case Operator.BETWEEN: {
				const parsed = ConditionBetweenSchema.parse(serialized);
				const condition = new Between(parsed.path, parsed.value);
				return condition;
			}

			case Operator.EQUAL: {
				const parsed = ConditionEqualSchema.parse(serialized);
				const condition = new Equal(parsed.path, parsed.value);
				return condition;
			}

			case Operator.GREATER_THAN_OR_EQUAL: {
				const parsed = ConditionGreaterThanOrEqualSchema.parse(serialized);
				const condition = new GreaterThanOrEqual(parsed.path, parsed.value);
				return condition;
			}

			case Operator.IN: {
				const parsed = ConditionInSchema.parse(serialized);
				const condition = new In(parsed.path, parsed.value);
				return condition;
			}

			case Operator.LESS_THAN: {
				const parsed = ConditionLessThanSchema.parse(serialized);
				const condition = new LessThan(parsed.path, parsed.value);
				return condition;
			}

			case Operator.NOT_EQUAL: {
				const parsed = ConditionNotEqualSchema.parse(serialized);
				const condition = new NotEqual(parsed.path, parsed.value);
				return condition;
			}

			default:
				throw new Error(`Unknown operator '${serialized.operator as string}' in ${JSON.stringify(serialized)}`);
		}
	}
}
