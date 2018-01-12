import {TemplateElement} from '../types-and-interfaces/template-element';

export function templateList(elements: TemplateElement[]): TemplateElement[] {
  return elements.reduce(
    (elms: TemplateElement[], elm: TemplateElement) => {
      let curr: TemplateElement[] = [elm];
      if (elm.children.length) {
        const templates: TemplateElement[] = elm.children.filter(
          (elm: TemplateElement | string) => {
            return typeof elm !== 'string';
          }
        ) as TemplateElement[];
        curr = curr.concat(templateList(templates));
      }
      return elms.concat(curr);
    }, []);
}
