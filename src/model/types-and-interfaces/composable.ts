import { EmceConstructor } from './emce-constructor';
import { EmceSubject } from '../emce-subject';
import { Func } from './function';

export type Composable<F extends EmceConstructor<EmceSubject<any>> | Func> = (next: F) => F;
