import {TemplateElement} from '../';
import {TemplateString} from '../types-and-interfaces/template-string';

export function getTemplateElements(children: Array<TemplateElement | TemplateString>): TemplateElement[] {
  return children.filter(
    (elm: TemplateElement | string) => {
      return typeof elm !== 'string';
    }
  )as TemplateElement[];
}
