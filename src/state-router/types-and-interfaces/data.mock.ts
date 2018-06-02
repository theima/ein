import { Data } from './data';
import { Subject, Observable } from 'rxjs';
import { State } from './state';

export class MockData {
  public returnValue: any = {};
  public errorValue: any = {};
  public lastState: State | null = null;
  public lastModel: any;
  private s: Subject<any>;

  constructor() {
    this.s = new Subject<any>();
  }

  public sendData() {
    this.s.next(this.returnValue);
  }

  public error() {
    this.s.error(this.errorValue);
  }

  public createData(): Data {
    //tslint:disable-next-line
    const holder: MockData = this;
    const o: Observable<any> = this.s;
    return (model: any, state: State) => {
      holder.lastModel = model;
      holder.lastState = state;
      return o;
    };
  }
}
