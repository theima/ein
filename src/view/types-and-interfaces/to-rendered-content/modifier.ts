import { TemplateToElement } from './template-to-element';

export type Modifier = (getId: () => number) => (next: TemplateToElement) => TemplateToElement;
