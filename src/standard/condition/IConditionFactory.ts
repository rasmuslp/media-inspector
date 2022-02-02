import { ConditionSerialised } from './conditions-schema';
import { ICondition } from './ICondition';

export interface IConditionFactory {
	create(conditionData: ConditionSerialised): ICondition
}
