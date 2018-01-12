import {Attribute} from './attribute';

export interface Tag {
  name: string;
  attributes?: Attribute[];
}
