import { Observable, Subject } from 'rxjs';

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

  public sendData(): void {
    this.s.next(this.returnData);
  }

  public error(): void {
    this.s.error(this.errorValue);
  }

  public createCan(): (m: unknown) => Observable<any> {
    // eslint-disable-next-line
    const holder: MockCan = this;
    const o = this.s;
    return (m: unknown) => {
      holder.lastCalledWith = m;
      holder.wasCalled = true;
      return o;
    };
  }
}
