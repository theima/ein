import { Emce } from './emce';
export type EmceConstructor<E extends Emce<any>> = new (...args: any[]) => E;
