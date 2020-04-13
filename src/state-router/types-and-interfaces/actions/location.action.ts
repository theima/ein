import { LocationChangeDirection } from '../location-change-direction';
import { RouterAction } from './router.action';

export interface LocationAction extends RouterAction {
  originatedFromLocationChange: true;
  direction: LocationChangeDirection;
}
