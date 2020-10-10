/* eslint-disable */
import { Translator } from '../types-and-interfaces/translator';
export class MockTranslator implements Translator<any, any> {
  public getReturnValue: any;
  public giveReturnValue: any;
  public get(m: any)  {
    return this.getReturnValue;
  }
  public give(m: any, mm: any) {
    return this.giveReturnValue;
  }
}
