import { RuleDescriptor } from '../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function rulesForState(stateDescriptor: StateDescriptor): RuleDescriptor[] {
  let rules: RuleDescriptor[] = [];
  let current: RuleDescriptor | undefined = stateDescriptor.rule;
  while (current) {
    rules.unshift(current);
    current = current.parent;
  }
  return rules;
}
