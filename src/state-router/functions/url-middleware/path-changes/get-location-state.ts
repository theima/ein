import { Location } from 'history';
import { HistoryId } from '../../../types-and-interfaces/history.id';
import { isHistoryId } from './is-history-id';

export function getLocationState(location: Location): HistoryId {
  if (isHistoryId(location.state)) {
    return location.state;
  }
  return { id: 0 };
}
