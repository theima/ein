import { Config } from '../../types-and-interfaces/config';
import { PathConfig } from '../../types-and-interfaces/path.config';
import { isPathConfig } from './is-path-config';

export function isPathConfigs(configs: Config[]): configs is PathConfig[] {
  return isPathConfig(configs[0]);
}
