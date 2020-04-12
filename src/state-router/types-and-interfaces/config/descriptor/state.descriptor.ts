import { Dict } from '../../../../core';
import { CanEnter } from '../can-enter';
import { CanLeave } from '../can-leave';
import { Data } from '../data';
import { Title } from '../title';

export interface StateDescriptor {
  name: string;
  title?: string | Title;
  path?: string;
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: CanLeave;
  parent?: StateDescriptor;
}
