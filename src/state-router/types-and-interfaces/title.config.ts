import { Config } from './config';
import { Title } from './title';

export interface TitleConfig extends Config {
  title: string | Title;
}
