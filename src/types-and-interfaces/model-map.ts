import {Attribute} from './attribute';

export type ModelMap = (attributes: Attribute[]) => (m:any) => any;
