import { TemplateString } from './template-string';
import { TemplateElement } from './template-element';
import { TemplateValidator } from './template-validator';
import { ViewData } from './view-data';

export interface EmceViewData extends ViewData{
  isEmce: true;
}
