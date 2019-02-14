import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelToElement, TemplateElement } from '../..';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { claimAttribute } from './claim-attribute';
import { Modifier } from '../../types-and-interfaces/modifier';

export function groupModifier(element: TemplateElement, createMap: (t: TemplateElement) => ModelToElement): ModelToElements {
  element = claimAttribute(Modifier.Group, element);
  const groupMap = createMap(element);
  return (m: object, im: object) => {
    //We know that the element delivered from a group data will be static.
    const group: StaticElement = groupMap(m, im) as any;
    return group.content;
  };
}
