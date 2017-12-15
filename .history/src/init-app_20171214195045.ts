import {h} from 'snabbdom';
import { patch } from './patch';

export function initApp(target: string): void {
  function view(currentDate: any) {
    return h('div', 'Current date ' + currentDate);
  }
  function initer() {
    let oldVnode: any = document.getElementById(target);
    let count = 0;
    setInterval( () => {
      let newVnode = view(new Date());
      if (count > 10) {
          newVnode = oldVnode as any;
      }
      count++;
      oldVnode = patch(oldVnode, newVnode);
    }, 1000);
  }
  initer();
}
