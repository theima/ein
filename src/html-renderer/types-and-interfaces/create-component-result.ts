import { Observable } from 'rxjs';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { Property } from '../../view/types-and-interfaces/property';
import { Value } from '../../core';

export interface CreateComponentResult {
  stream: Observable<Array<Element | string>>;
  updateChildren: (properties: Property[], model: Value) => void;
  onDestroy: () => void;
}
