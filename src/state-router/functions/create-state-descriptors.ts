import { PathConfig } from '../types-and-interfaces/path.config';
import { RuleConfig } from '../types-and-interfaces/rule.config';
import { RuleDescriptor } from '../types-and-interfaces/rule.descriptor';
import { StateConfig } from '../types-and-interfaces/state.config';
import { StateDescriptor } from '../types-and-interfaces/state.descriptor';

export function createStateDescriptors(config: Array<RuleConfig | StateConfig>): StateDescriptor[] {
  let id: number = 0;
  const configsToDescriptors: (states: Array<RuleConfig | StateConfig>, parent: StateConfig & PathConfig | null, parentRule: RuleDescriptor | null) => StateDescriptor[] =
    (states: Array<RuleConfig | StateConfig>, parent: StateConfig & PathConfig | null, parentRule: RuleDescriptor | null) => {
      return states.reduce(
        (descriptors: StateDescriptor[], c: RuleConfig | StateConfig) => {
        return descriptors.concat(toDescriptor(c, parent, parentRule));
      }, []);
    };
  const toDescriptor: (item: RuleConfig | StateConfig, parent: StateConfig & PathConfig | null, parentRule: RuleDescriptor | null) => StateDescriptor[] =
    (item: RuleConfig | StateConfig, parent: StateConfig & PathConfig | null, parentRule: RuleDescriptor | null) => {
      const conf: any = item;
      if (conf.name !== undefined) {
        const config: StateConfig & PathConfig = item as StateConfig & PathConfig;
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
  return configsToDescriptors(config, null, null);
}
