import { Composable } from '../types-and-interfaces/composable';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { NodeSubject } from '../node-subject';
import { Func } from '../types-and-interfaces/function';

export function compose(last: NodeConstructor<NodeSubject<any>>, ...functions: Array<Composable<NodeConstructor<NodeSubject<any>>>>): NodeConstructor<NodeSubject<any>>;
export function compose<F extends Func>(last: F, ...functions: Array<Composable<F>>): F;
export function compose<F extends Func>(last: F, ...functions: Array<Composable<F>>): F {
  return functions
    .reduceRight((prev: F,
                  curr: Composable<F>) => {
      return curr(prev);
    }, last);
}
