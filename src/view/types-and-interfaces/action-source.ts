import { Attribute } from './attribute';

export interface ActionSource {
  actionSource: {
    name: string,
    attributes: Attribute[]
  };
}
