import { RuleDescriptor } from '../../types-and-interfaces/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';
import { rulesForState } from './rules-for-state';

describe('rulesForState', () => {
  it('Should order rules in an array', () => {
    const state: StateDescriptor = {
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
    const expected: RuleDescriptor[] = [
      {
        id: 1,
        canEnter: {} as any,
        parent: null
      },
      {
        id: 2,
        canEnter: {} as any,
        parent: {
          id: 1,
          canEnter: {} as any,
          parent: null
        }
      },
      {
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
      }
    ];
    expect(rulesForState(state)).toEqual(expected);
  });
});
