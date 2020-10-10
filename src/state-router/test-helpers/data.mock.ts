/* eslint-disable */
import { Observable, Subject } from 'rxjs';
import { Data } from '../types-and-interfaces/config/data';
import { State } from '../types-and-interfaces/state/state';

export class MockData {
  public returnValue: any = {};
  public errorValue: any = {};
  public lastState: State | null = null;
  public lastModel: any;
  private s: Subject<any>;

  constructor() {
    this.s = new Subject<any>();
  }

  public sendData(): void {
    this.s.next(this.returnValue);
  }

  public error(): void {
    this.s.error(this.errorValue);
  }

  public createData(): Data {
    // eslint-disable-next-line
    const holder: MockData = this;
    const o: Observable<any> = this.s;
    return (model: any, state: State) => {
      holder.lastModel = model;
      holder.lastState = state;
      return o;
    };
  }
}
