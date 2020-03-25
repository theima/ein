import { Config } from '../../types-and-interfaces/config/config';
import { PathConfig } from '../../types-and-interfaces/config/path.config';

export function isPathConfig(config: Config | undefined): config is PathConfig {
  return !!config && !!(config as PathConfig).path !== undefined;
}
