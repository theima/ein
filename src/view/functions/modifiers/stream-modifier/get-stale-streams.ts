import { Observable } from 'rxjs';
import { ActionStreamSubscription } from '../../../types-and-interfaces/select-action/action-stream-subscription';
import { ActionStreamSubscriptions } from '../../../types-and-interfaces/select-action/action-stream-subscriptions';

export function getStaleStreams(oldStreams: ActionStreamSubscriptions[], newStreams: ActionStreamSubscriptions[]): ActionStreamSubscription[] {
  const liveStreams: Array<Observable<any>> = newStreams.map((s) => s.on);
  return oldStreams.reduce(
    (stale: ActionStreamSubscription[], s: ActionStreamSubscriptions) => {
      const index = liveStreams.indexOf(s.on);
      if (index === -1) {
        return stale.concat(s.subscriptions);
      }
      const activeSubStreams = newStreams[index].subscriptions.map((s) => s.stream);
      const staleSubStreams = s.subscriptions.reduce(
        (stale: ActionStreamSubscription[], sub) => {
          if (activeSubStreams.indexOf(sub.stream) === -1) {
            stale.push(sub);
          }
          return stale;
        }, []);

      return stale.concat(staleSubStreams);
    }, []);
}
