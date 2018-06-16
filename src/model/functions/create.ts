import { Node } from '../types-and-interfaces/node';
import { makeCreate } from './make-create';
import { ActionMaps } from '../types-and-interfaces/action-maps';
import { ActionMap } from '../types-and-interfaces/action-map';

export const create: <T>(actionMapOrActionMaps: ActionMap<T> | ActionMaps<T> ,
                         initial: T) => Node<T> = makeCreate([], []);
