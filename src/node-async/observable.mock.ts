import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PartialObserver } from 'rxjs/Observer';
export class MockObservable extends Observable<any> {
  public runOnSubscribe: () => void;
  public subscription: any = {
    unsubscribe: () => {
      // .
    }
  };
  private completeFunc: any;

  public complete() {
    if (this.completeFunc) {
      this.completeFunc();
    }
  }

  public subscribe(): Subscription;
  public subscribe(observer: PartialObserver<any>): Subscription;
  public subscribe(next?: ((value: any) => void),
                   error?: (error: any) => void,
                   complete?: () => void): Subscription;
  public subscribe(nextOrObserver?: ((value: any) => void) | PartialObserver<any>,
                   error?: (error: any) => void,
                   complete?: () => void): Subscription {
    this.completeFunc = complete;
    if (this.runOnSubscribe) {
      this.runOnSubscribe();
    }
    return this.subscription;
  }
}
