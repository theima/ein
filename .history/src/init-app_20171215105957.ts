import {h} from 'snabbdom';
import { patch } from './patch';

export function initApp(target: string): void {
  function initer() {
    let oldVnode: any = document.getElementById(target);
    let count = 0;
    setInterval( () => {
      let newVnode = h('div', 'n:' + count);
      if (count > 10) {
          newVnode = oldVnode as any;
      }
      count++;
      oldVnode = patch(oldVnode, newVnode);
    }, 1000);
  }
  initer();
}
