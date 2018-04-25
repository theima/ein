import { Composable } from '../types-and-interfaces/composable';
import { EmceConstructor } from '../types-and-interfaces/emce-constructor';
import { EmceSubject } from '../emce-subject';
import { Func } from '../types-and-interfaces/function';

export function compose(last: EmceConstructor<EmceSubject<any>>, ...functions: Array<Composable<EmceConstructor<EmceSubject<any>>>>): EmceConstructor<EmceSubject<any>>;
export function compose<F extends Func>(last: F, ...functions: Array<Composable<F>>): F;
export function compose<F extends Func>(last: F, ...functions: Array<Composable<F>>): F {
  return functions
    .reduceRight((prev: F,
                  curr: Composable<F>) => {
      return curr(prev);
    }, last);
}
