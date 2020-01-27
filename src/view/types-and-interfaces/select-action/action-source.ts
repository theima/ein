import { Property } from '../property';

export interface ActionSource {
  actionSource: {
    name: string,
    properties: Property[]
  };
}
