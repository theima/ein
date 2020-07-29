import { ModelToString } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { isElementTemplate } from '../type-guards/is-element-template';

export function toHtmlNode(template: ElementTemplate | string | ModelToString): HTMLElement | Text {
  if (isElementTemplate(template)) {
    const element = document.createElement(template.name);
    template.properties.forEach((p) => {
      element.setAttribute(p.name, p.value as any);
    });
    template.content.forEach((c) => {
      const ec = toHtmlNode(c);
      element.appendChild(ec);
    });
    return element;
  }
  return document.createTextNode(template as any);

}
