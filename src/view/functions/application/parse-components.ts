import { arrayToDict, Dict } from '../../../core';
import { ComponentTemplate } from '../../types-and-interfaces/component/component';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { View } from '../../types-and-interfaces/view';

export function parseComponents(parser: (template: string) => ElementTemplateContent[],
                                components: Array<View<ComponentTemplate>> = []): Dict<ComponentTemplate> {
  return arrayToDict('name', components.map((c) => c(parser)));
}
