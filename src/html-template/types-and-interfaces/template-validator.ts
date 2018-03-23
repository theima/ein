import { TemplateAttribute } from './template-attribute';

export type TemplateValidator = (attributes: TemplateAttribute[]) => boolean;
