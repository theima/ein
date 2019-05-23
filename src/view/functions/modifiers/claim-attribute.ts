import { TemplateElement } from '../..';

export function claimAttribute<T extends TemplateElement>(attributeName: string, element: T): T {
  return {...element, properties: element.properties.filter(e => e.name !== attributeName)};
}
