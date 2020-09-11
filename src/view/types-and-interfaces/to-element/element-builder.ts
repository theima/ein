import { TemplateContentToElements } from './template-content-to-elements';
import { TemplateToElement } from './template-to-element';

export type ElementBuilder = (toContent: TemplateContentToElements) => (next: TemplateToElement) => TemplateToElement;
