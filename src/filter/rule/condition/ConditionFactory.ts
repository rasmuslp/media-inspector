import crypto from 'crypto';

import { ConditionOperator } from './ConditionOperator';

import { Condition, ConditionData } from './Condition';
import { ConditionBetween, TConditionBetween } from './operators/ConditionBetween';
import { ConditionEqual, TConditionEqual } from './operators/ConditionEqual';
import { ConditionGreaterThanOrEqual, TConditionGreaterThanOrEqual } from './operators/ConditionGreaterThanOrEqual';
import { ConditionIn, TConditionIn } from './operators/ConditionIn';
import { ConditionLessThan, TConditionLessThan } from './operators/ConditionLessThan';
import { ConditionNotEqual, TConditionNotEqual } from './operators/ConditionNotEqual';

import { decodeTo } from '../../../lib/io-ts';

export class ConditionFactory {
	static _conditions = new Map<string, Condition>();

	static getSharedInstanceFromSerialized(conditionData: ConditionData): Condition {
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

	static getFromSerialized(condition: ConditionData): Condition {
		// Create and return
		switch (condition.operator) {
			case ConditionOperator.BETWEEN: {
				const data = decodeTo(TConditionBetween, condition);
				return new ConditionBetween(data.path, data.value);
			}

			case ConditionOperator.EQUAL: {
				const data = decodeTo(TConditionEqual, condition);
				return new ConditionEqual(data.path, data.value);
			}

			case ConditionOperator.GREATER_THAN_OR_EQUAL: {
				const data = decodeTo(TConditionGreaterThanOrEqual, condition);
				return new ConditionGreaterThanOrEqual(data.path, data.value);
			}

			case ConditionOperator.IN: {
				const data = decodeTo(TConditionIn, condition);
				return new ConditionIn(data.path, data.value);
			}

			case ConditionOperator.LESS_THAN: {
				const data = decodeTo(TConditionLessThan, condition);
				return new ConditionLessThan(data.path, data.value);
			}

			case ConditionOperator.NOT_EQUAL: {
				const data = decodeTo(TConditionNotEqual, condition);
				return new ConditionNotEqual(data.path, data.value);
			}

			default:
				throw new Error(`Unknown operator '${condition.operator as string}' in ${JSON.stringify(condition)}`);
		}
	}
}
