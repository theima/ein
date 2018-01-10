import {TemplateElement} from '../template-element';

export function flatten(elements: TemplateElement[]): TemplateElement[] {
  return elements.reduce(
    (elms: TemplateElement[], elm: TemplateElement) => {
      let curr: TemplateElement[] = [elm];
      if (elm.children.length) {
        const templates: TemplateElement[] = elm.children.filter(
          (elm: TemplateElement | string) => {
            return typeof elm !== 'string';
          }
        ) as TemplateElement[];
        curr = curr.concat(flatten(templates));
      }
      return elms.concat(curr);
    }, []);
}
