//tslint:disable
export function makeMap(str: string) {
  let obj = {};
  let items = str.split(',');
  for (let i: number = 0; i < items.length; i++) {
    obj[items[i]] = true;
  }
  return obj;
}
