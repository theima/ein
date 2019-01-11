import { TemplateElement } from '../../index';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { createElement } from './create-element';
import { mapContent } from './map-content';
import { mapAttributes } from './map-attributes';
import { StaticElement } from '../../types-and-interfaces/elements/static-element';

export function toElement(content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                          id: string,
                          template: TemplateElement,
                          model: object): StaticElement {
  const mappedAttributes = mapAttributes(template.attributes, model);
  const mappedContent = mapContent(content, model);
  const e = createElement(template.name, id, mappedAttributes, mappedContent, null);
  return {...e};
}
