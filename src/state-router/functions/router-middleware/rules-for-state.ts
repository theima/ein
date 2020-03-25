import { RuleDescriptor } from '../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';

export function rulesForState(state: StateDescriptor): RuleDescriptor[] {
  let rules: RuleDescriptor[] = [];
  let current: RuleDescriptor | null = state.rule;
  while (current) {
    rules.unshift(current);
    current = current.parent;
  }
  return rules;
}
