import { HistoryId } from '../../../types-and-interfaces/history.id';

export function isHistoryId(object: any): object is HistoryId {
  if (object !== null && typeof object === 'object') {
    return typeof (object as any).id === 'number';
  }
  return false;
}
