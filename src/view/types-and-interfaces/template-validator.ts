import { DynamicAttribute } from '../index';
import { Attribute } from './attribute';

export type TemplateValidator = (attributes: Array<Attribute | DynamicAttribute>) => boolean;
