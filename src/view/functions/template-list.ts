import {TemplateElement} from '../types-and-interfaces/template-element';
import {getTemplateElements} from './get-template-elements';

export function templateList(elements: TemplateElement[]): TemplateElement[] {
  return elements.reduce(
    (elms: TemplateElement[], elm: TemplateElement) => {
      let curr: TemplateElement[] = [elm];
      if (elm.children.length) {
        const templates: TemplateElement[] = getTemplateElements(elm.children);
        curr = curr.concat(templateList(templates));
      }
      return elms.concat(curr);
    }, []);
}
