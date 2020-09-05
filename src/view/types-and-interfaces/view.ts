
import { ElementTemplateContent } from './templates/element-template-content';
import { ViewTemplate } from './view-templates/view-template';

export type View<T extends ViewTemplate> = (parser: (html:string) => ElementTemplateContent[]) => T;
