import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { RuleDescriptor } from '../types-and-interfaces/rule.descriptor';

export function rulesForState(state: StateDescriptor): RuleDescriptor[] {
  let rules: RuleDescriptor[] = [];
  let current: RuleDescriptor | null = state.rule;
  while (current) {
    rules.unshift(current);
    current = current.parent;
  }
  return rules;
}