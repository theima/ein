import { TemplateContentToRenderedContentList } from './template-content-to-rendered-content-list';
import { TemplateToElement } from './template-to-element';

export type ElementBuilder = (
  toContent: TemplateContentToRenderedContentList
) => (next: TemplateToElement) => TemplateToElement;
