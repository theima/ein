import { Config } from '../../types-and-interfaces/config';
import { TitleConfig } from '../../types-and-interfaces/title.config';

export function isTitleConfig(config: Config | undefined): config is TitleConfig {
    return !!config && !!(config as TitleConfig).title;
}
