import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class MockCan {
  public errorValue: any = {};
  public returnData: any;
  public lastCalledWith: any;
  public wasCalled: boolean = false;
  private s: Subject<any>;

  constructor() {
    this.s = new Subject<any>();
    this.returnData = true;
  }

  public sendData() {
    this.s.next(this.returnData);
  }

  public error() {
    this.s.error(this.errorValue);
  }

  public createCan(): (m: any) => Observable<any> {
    //tslint:disable-next-line
    const holder: MockCan = this;
    const o = this.s;
    return (m: any) => {
      holder.lastCalledWith = m;
      holder.wasCalled = true;
      return o;
    };
  }
}
