import { TitleConfig } from '../../../core/types-and-interfaces/title.config';
import { Config } from '../../../core/types-and-interfaces/config';

export function isTitleConfig(config: Config): config is TitleConfig {
    return !!config && !!(config as TitleConfig).title;
}
