import {Attribute} from './attribute';

export type ViewMap = (attributes: Attribute[]) => (m:any) => any;
