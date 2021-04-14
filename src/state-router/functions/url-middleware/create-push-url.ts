import { History } from 'history';
import { HistoryId } from '../../types-and-interfaces/history.id';

export function createPushUrl(history: History, getId: () => HistoryId): (url: string) => void {
  return (url: string) => {
    history.push(url, getId());
  };
}
