import { RuleDescriptor } from '../../types-and-interfaces/config/descriptor/rule.descriptor';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { rulesForState } from './rules-for-state';

describe('rulesForState', () => {
  it('Should order rules in an array', () => {
    const state: StateDescriptor= {
      name: 'a',
      rule: {
        id: 3,
        canEnter: {} as any,
        parent: {
          id: 2,
          canEnter: {} as any,
          parent: {
            id: 1,
            canEnter: {} as any
          }
        }
      }

    };
    const expected: RuleDescriptor[] = [
      {
        id: 1,
        canEnter: {} as any
      },
      {
        id: 2,
        canEnter: {} as any,
        parent: {
          id: 1,
          canEnter: {} as any
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
            canEnter: {} as any
          }
        }
      }
    ];
    expect(rulesForState(state)).toEqual(expected);
  });
});
