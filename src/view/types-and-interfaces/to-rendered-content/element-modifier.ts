import { TemplateToContent } from './template-to-content';
import { TemplateToElement } from './template-to-element';

export type ElementModifier = (
  create: TemplateToElement
) => (next: TemplateToContent) => TemplateToContent;
