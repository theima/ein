export class Stack<T> {
  private store: T[];

  constructor(collection: T[] = []) {
    this.store = collection.concat();
  }

  get count(): number {
    return this.store.length;
  }

  public pop(): T | undefined {
    return this.store.pop() as T;
  }

  public push(value: T) {
    this.store.push(value);
  }

  public peek(): T | undefined {
    if (this.store.length) {
      return this.store[this.store.length - 1];
    }
    return undefined;
  }

  public clone(): Stack<T> {
    return new Stack(this.store);
  }
}
