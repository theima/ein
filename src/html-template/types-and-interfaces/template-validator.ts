import { Attribute } from '../../view';
import { ModelToAttribute } from '../../view/types-and-interfaces/model-to-attribute';

export type TemplateValidator = (attributes: Array<Attribute | ModelToAttribute>) => boolean;
