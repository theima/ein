
import { ElementTemplateContent } from './element-template/element-template-content';
import { ViewTemplate } from './view-template/view-template';

export type View<T extends ViewTemplate> = (parser: (html:string) => ElementTemplateContent[]) => T;
