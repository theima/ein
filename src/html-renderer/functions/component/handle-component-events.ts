import { Observable, Subscription } from 'rxjs';
import { NativeElement } from '../../types-and-interfaces/native-element';
import { NativeEvent } from '../../types-and-interfaces/native-event';

export function handleComponentEvents(element: NativeElement, events?: Observable<NativeEvent>): () => void {
  let eventSubscription: Subscription;
  if (events) {
    eventSubscription = events.subscribe((e: NativeEvent) => {
      // placing the event on the queue of the event loop.
      setTimeout(
        () => {
          element.dispatchEvent(e);
        }
      );
    });
  }
  return  () => {
    if (eventSubscription) {
      eventSubscription.unsubscribe();
    }
  };
}
