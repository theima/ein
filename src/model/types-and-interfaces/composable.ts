import { NodeConstructor } from './node-constructor';
import { NodeSubject } from '../node-subject';
import { Func } from './function';

export type Composable<F extends NodeConstructor<NodeSubject<any>> | Func> = (next: F) => F;
