import {TemplateElement} from '../template-element';
import {Element} from '../element';

export function view(tag: string, template: Array<TemplateElement | string>): Element {
  let element: TemplateElement = {
    tag,
    children: template
  };
  return {
    tag,
    element
  };
}
