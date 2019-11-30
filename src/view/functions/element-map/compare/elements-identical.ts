import { LiveElement } from '../../../types-and-interfaces/elements/live.element';
import { StaticElement } from '../../../types-and-interfaces/elements/static.element';
import { isLiveElement } from '../../type-guards/is-live-element';
import { isStaticElement } from '../../type-guards/is-static-element';
import { propertyArraysIdentical } from './property-arrays-identical';
import { staticElementContentsIdentical } from './static-element-contents-identical';

export function elementsIdentical<T extends StaticElement | LiveElement>(a: T | null, b: T | null): boolean {
  if (!a || !b) {
    return false;
  }
  /*
    handlers?: ActionHandler[];
    actionStream?: Observable<Action>;
  */
  if (!propertyArraysIdentical(a.properties, b.properties)) {
    return false;
  }
  if (isStaticElement(a)) {
    if (!staticElementContentsIdentical(a.content, (b as StaticElement).content)) {
      return false;
    }
  } else if (isLiveElement(a)) {
    if (a.childStream !== (b as LiveElement).childStream) {
      return false;
    }
  }
  return false;//Temp
}
