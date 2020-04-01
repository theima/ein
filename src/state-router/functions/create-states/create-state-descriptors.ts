import { RuleDescriptor } from '../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { RuleConfig } from '../../types-and-interfaces/config/rule.config';
import { StateConfig } from '../../types-and-interfaces/config/state.config';
import { verifyStateDescriptors } from './verify-state-descriptors';

export function createStateDescriptors(config: Array<RuleConfig | StateConfig>): StateDescriptor[] {
  let id: number = 0;
  const configsToDescriptors: (states: Array<RuleConfig | StateConfig>, parent: StateConfig | null, parentRule: RuleDescriptor | null) => StateDescriptor[] =
    (states: Array<RuleConfig | StateConfig>, parent: StateConfig | null, parentRule: RuleDescriptor | null) => {
      return states.reduce(
        (descriptors: StateDescriptor[], c: RuleConfig | StateConfig) => {
        return descriptors.concat(toDescriptor(c, parent, parentRule));
      }, []);
    };
  const toDescriptor: (item: RuleConfig | StateConfig, parent: StateConfig | null, parentRule: RuleDescriptor | null) => StateDescriptor[] =
    (item: RuleConfig | StateConfig, parent: StateConfig | null, parentRule: RuleDescriptor | null) => {
      const conf: any = item;
      if (conf.name !== undefined) {
        const config: StateConfig = item as StateConfig;
        let desc: any = {
          ...config,
          rule: parentRule,
          parent: parent ? parent.name : null
        };
        if (config.path && parent) {
          desc.path = parent.path + config.path;
        }
        let result: StateDescriptor[] = [desc];
        if (config.children) {
          result = result.concat(configsToDescriptors(config.children, config, null));
          delete desc.children;
        }
        return result;
      }
      const ruleConfig: RuleConfig = item as any;
      const newRule: RuleDescriptor = {canEnter: item.canEnter, parent: parentRule, id: ++id};
      return configsToDescriptors(ruleConfig.states, parent, newRule);
    };
  const descriptors = configsToDescriptors(config, null, null);
  verifyStateDescriptors(descriptors, 'path');
  verifyStateDescriptors(descriptors, 'title');
  return descriptors;
}
