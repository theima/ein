import { Config } from '../../types-and-interfaces/config/config';
import { RuleDescriptor } from '../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { RuleConfig } from '../../types-and-interfaces/config/rule.config';
import { StateConfig } from '../../types-and-interfaces/config/state.config';
import { isStateConfig } from '../type-guards/is-state-config';
import { toStateDescriptor } from './to-state-descriptor';
import { verifyStateDescriptors } from './verify-state-descriptors';

export function createStateDescriptors(config: Config[]): StateDescriptor[] {
  let id: number = 0;
  const configsToDescriptors = (states: Config[] = [], parent?: StateConfig, parentRule?: RuleDescriptor) => {
      return states.reduce(
        (descriptors: StateDescriptor[], c: Config) => {
        return descriptors.concat(toDescriptor(c, parent, parentRule));
      }, []);
    };
  const toDescriptor: (item: Config, parent?: StateConfig, parentRule?: RuleDescriptor) => StateDescriptor[] =
    (item: Config, parent?: StateConfig, parentRule?: RuleDescriptor) => {
      if (isStateConfig(item)) {
        const config: StateConfig = item;
        let descriptor: StateDescriptor = toStateDescriptor(item, parent, parentRule);
        let result: StateDescriptor[] = [descriptor];
        result = result.concat(configsToDescriptors(config.children, config));
        return result;
      }
      // handles rule-configs.
      const ruleConfig: RuleConfig = item as any;
      const newRule: RuleDescriptor = {canEnter: item.canEnter, parent: parentRule, id: ++id};
      return configsToDescriptors(ruleConfig.states, parent, newRule);
    };
  const descriptors = configsToDescriptors(config);
  verifyStateDescriptors(descriptors, 'path');
  verifyStateDescriptors(descriptors, 'title');
  return descriptors;
}
