import { Attribute } from '../index';
import { ModelToAttribute } from './model-to-attribute';

export type TemplateValidator = (attributes: Array<Attribute | ModelToAttribute>) => boolean;
