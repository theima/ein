import { Config } from '../../types-and-interfaces/config/config';
import { TitleConfig } from '../../types-and-interfaces/config/title.config';
import { isTitleConfig } from './is-title-config';

export function isTitleConfigs(configs: Config[]): configs is TitleConfig[] {
  return isTitleConfig(configs[0]);
}
