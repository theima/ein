import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { RuleDescriptor } from '../types-and-interfaces/rule.descriptor';
import { rulesForState } from './rules-for-state';
import { CanEnter } from '../types-and-interfaces/canEnter';

export function enteredRules(entering: StateDescriptor, leaving: StateDescriptor | null): CanEnter[] {
  const leavingRules: RuleDescriptor[] = leaving ? rulesForState(leaving) : [];
  let enteringRules: RuleDescriptor[] = rulesForState(entering);
  enteringRules = enteringRules.reduce((entering: RuleDescriptor[], rule: RuleDescriptor, i: number) => {
    if (!leavingRules[i] || leavingRules[i].id !== rule.id) {
      entering.push(rule);
    }
    return entering;
  }, []);
  return enteringRules.map(g => g.canEnter);
}
