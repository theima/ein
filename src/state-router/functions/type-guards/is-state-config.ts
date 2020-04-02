import { Config } from '../../types-and-interfaces/config/config';
import { StateConfig } from '../../types-and-interfaces/config/state.config';

export function isStateConfig(config: Config): config is StateConfig {
  return !!(config as StateConfig).name;
}
