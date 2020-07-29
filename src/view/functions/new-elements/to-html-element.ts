import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { isElementTemplate } from '../type-guards/is-element-template';

export function toHtmlElement(template: ElementTemplate | string): HTMLElement | Text {
  if (isElementTemplate(template)) {
    const element = document.createElement(template.name);
    template.properties.forEach((p) => {
      element.setAttribute(p.name, p.value as any);
    });
    return element;
  }
  return document.createTextNode(template);

}
