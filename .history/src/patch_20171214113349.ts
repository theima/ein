import {h, init} from 'snabbdom';
import * as classModule from 'snabbdom/modules/class';
export const patch = init([
    classModule.default, // makes it easy to toggle classes
    
  ]);