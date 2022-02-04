import { Between } from './types/Between';
import { Equal } from './types/Equal';
import { GreaterThanOrEqual } from './types/GreaterThanOrEqual';
import { In } from './types/In';
import { LessThan } from './types/LessThan';
import { NotEqual } from './types/NotEqual';
import {
	ConditionBetweenSchema,
	ConditionEqualSchema,
	ConditionGreaterThanOrEqualSchema,
	ConditionInSchema, ConditionLessThanSchema, ConditionNotEqualSchema, ConditionSerialised
} from './ConditionSchema';
import { ICondition } from './ICondition';
import { IConditionFactory } from './IConditionFactory';
import { Operator } from './Operator';

export class ConditionFactory implements IConditionFactory {
	public create(serialized: ConditionSerialised): ICondition {
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
				throw new Error(`Unknown operator in ${JSON.stringify(serialized)}`);
		}
	}
}
