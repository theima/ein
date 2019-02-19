import { StateDescriptor } from '../types-and-interfaces/state.descriptor';
import { enteredRules } from './entered-rules';

describe('entered', () => {
  it('Should return empty array for equal states', () => {
    const leaving: StateDescriptor = {
      name: 'a',
      rule: {
        id: 3,
        canEnter: {} as any,
        parent: {
          id: 2,
          canEnter: {} as any,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    const entering: StateDescriptor = {
      name: 'b',
      rule: {
        id: 3,
        canEnter: {} as any,
        parent: {
          id: 2,
          canEnter: {} as any,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    expect(enteredRules(entering, leaving)).toEqual([]);
  });
  it('Should return empty array when only leaving', () => {
    const leaving: StateDescriptor = {
      name: 'a',
      rule: {
        id: 3,
        canEnter: {} as any,
        parent: {
          id: 2,
          canEnter: {} as any,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    const entering: StateDescriptor = {
      name: 'b',
      rule: {
        id: 2,
        canEnter: {} as any,
        parent: {
          id: 1,
          canEnter: {} as any,
          parent: null
        }
      },
      parent: null
    };
    expect(enteredRules(entering, leaving)).toEqual([]);
  });
  it('Should add enter for entering state', () => {
    const leaving: StateDescriptor = {
      name: 'a',
      rule: null,
      parent: null
    };
    const enter1: any = {a: 'a'};
    const entering: StateDescriptor = {
      name: 'b',
      rule: {
        id: 1,
        canEnter: enter1,
        parent: null
      },
      parent: null
    };
    expect(enteredRules(entering, leaving)).toEqual([enter1]);
  });
  it('Should add enter for entering state from no state', () => {
    const enter1: any = {a: 'a'};
    const entering: StateDescriptor = {
      name: 'b',
      rule: {
        id: 1,
        canEnter: enter1,
        parent: null
      },
      parent: null
    };
    expect(enteredRules(entering, null)).toEqual([enter1]);
  });
  it('Should return enter for sibling state', () => {
    const leaving: StateDescriptor = {
      name: 'a',
      rule: {
        id: 3,
        canEnter: {} as any,
        parent: {
          id: 2,
          canEnter: {} as any,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    const enter4: any = {a: 'a'};
    const entering: StateDescriptor = {
      name: 'b',
      rule: {
        id: 4,
        canEnter: enter4,
        parent: {
          id: 2,
          canEnter: {} as any,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    expect(enteredRules(entering, leaving)).toEqual([enter4]);
  });
  it('Should add all entered states', () => {
    const leaving: StateDescriptor = {
      name: 'a',
      rule: {
        id: 1,
        canEnter: {} as any,
        parent: null
      },
      parent: null
    };
    const enter2: any = {a: 'a'};
    const enter3: any = {b: 'b'};
    const entering: StateDescriptor = {
      name: 'b',
      rule: {
        id: 3,
        canEnter: enter3,
        parent: {
          id: 2,
          canEnter: enter2,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    expect(enteredRules(entering, leaving)).toEqual([enter2, enter3]);
  });

  it('Should return enters for sibling child states', () => {
    const leaving: StateDescriptor = {
      name: 'a',
      rule: {
        id: 3,
        canEnter: {} as any,
        parent: {
          id: 2,
          canEnter: {} as any,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    const enter4: any = {a: 'a'};
    const enter5: any = {b: 'b'};
    const entering: StateDescriptor = {
      name: 'b',
      rule: {
        id: 5,
        canEnter: enter5,
        parent: {
          id: 4,
          canEnter: enter4,
          parent: {
            id: 1,
            canEnter: {} as any,
            parent: null
          }
        }
      },
      parent: null
    };
    expect(enteredRules(entering, leaving)).toEqual([enter4, enter5]);
  });
});
