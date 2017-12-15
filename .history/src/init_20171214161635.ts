import {h} from 'snabbdom';

export function init(target: string): void {
  function view(currentDate: any) { 
    return h('div', 'Current date ' + currentDate); 
  }
}
