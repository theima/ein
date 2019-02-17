import { TemplateElement } from '../..';

export function claimAttribute<T extends TemplateElement>(attributeName: string, element: T): T {
  return {...element, attributes: element.attributes.filter(e => e.name !== attributeName)};
}
