import { Title } from '../title';
import { StateDescriptor } from './state.descriptor';

export interface TitleStateDescriptor extends StateDescriptor {
  title: string | Title;
}
