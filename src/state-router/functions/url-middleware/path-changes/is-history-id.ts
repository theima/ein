import { HistoryId } from '../../../types-and-interfaces/history.id';

export function isHistoryId(object: unknown): object is HistoryId {
  if (object !== null && typeof object === 'object') {
    return typeof (object as HistoryId).id === 'number';
  }
  return false;
}
