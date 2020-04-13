import { Location } from 'history';

export function getLocationState(location: Location): number {
  if (typeof location.state === 'number') {
    return location.state;
  }
  return 0;
}
