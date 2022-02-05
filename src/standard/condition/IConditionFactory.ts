import { ConditionSerialised } from './ConditionSchema';
import { ICondition } from './ICondition';

export interface IConditionFactory {
	create(conditionData: ConditionSerialised): ICondition
}
