import {TemplateElement} from '../types-and-interfaces/template-element';

export function replaceChildWithId(template: TemplateElement, child: TemplateElement): TemplateElement {
  const newTemplate: TemplateElement = {...template};
  if (child.id !== undefined) {
    if (template.id === child.id) {
      return child;
    }
    const id = child.id;
    let foundChild: boolean = false;
    let children = newTemplate.children.reduce(
      (list: Array<TemplateElement | string>, current) => {
        if (typeof current !== 'string') {
          if (current.id === id) {
            foundChild = true;
            current = child;
          } else if (!foundChild) {
            const result = replaceChildWithId(current, child);
            foundChild = result !== current;
            current = result;
          }
        }
        list.push(current);
        return list;
      }, []);

    if (foundChild) {
      newTemplate.children = children;
      return newTemplate;
    }
  }
  return template;
}
