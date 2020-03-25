import { Config } from '../../types-and-interfaces/config/config';
import { TitleConfig } from '../../types-and-interfaces/config/title.config';

export function isTitleConfig(config: Config | undefined): config is TitleConfig {
    return !!config && !!(config as TitleConfig).title;
}
