export class Stack<T> {
  private store: T[];

  constructor(collection: T[] = []) {
    this.store = collection.concat();
  }

  get count(): number {
    return this.store.length;
  }

  public pop(): T | null {
    if (this.store.length) {
      return this.store.pop() as T;
    }
    return null;
  }

  public push(value: T) {
    this.store.push(value);
  }

  public peek(): T | null {
    if (this.store.length) {
      return this.store[this.store.length - 1];
    }
    return null;
  }

  public clone(): Stack<T> {
    return new Stack(this.store);
  }
}
