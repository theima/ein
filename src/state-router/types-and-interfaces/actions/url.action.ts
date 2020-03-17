import { RouterAction } from './router.action';

export interface UrlAction extends RouterAction {
  originatedFromLocationChange: true;
}
