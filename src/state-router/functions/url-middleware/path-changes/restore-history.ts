import { LocationAction } from '../../../types-and-interfaces/actions/location.action';
import { LocationChangeDirection } from '../../../types-and-interfaces/location-change-direction';
import { history } from './history';

export function restoreHistory(
  blockNext: () => void,
  action: LocationAction
): void {
  if (action.direction !== LocationChangeDirection.Unknown) {
    blockNext();
    if (action.direction === LocationChangeDirection.Backward) {
      history.forward();
    } else {
      history.back();
    }
  }
}
