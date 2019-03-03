import { createStateDescriptors } from './create-state-descriptors';
import { StateDescriptor } from '../../types-and-interfaces/state.descriptor';

describe('createStateDescriptors', () => {
  describe('with rule at root level', () => {
    it('Should have null for states without rule', () => {
      const config = [
        {name: 'a'}
      ];
      const expected = [
        {
          name: 'a',
          rule: null,
          parent: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
    it('Should have rule for the states that have rules', () => {
      const config = [
        {name: 'a'},
        {
          canEnter: {} as any,
          states: [
            {name: 'b'}
          ]
        }
      ];
      const expected: StateDescriptor[] = [
        {
          name: 'a',
          rule: null,
          parent: null
        },
        {
          name: 'b',
          rule: {
            id: 1,
            parent: null,
            canEnter: {} as any
          },
          parent: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
    it('Should have sub rules', () => {
      const config = [
        {name: 'a'},
        {
          canEnter: {} as any,
          states: [
            {name: 'b'},
            {
              canEnter: {} as any,
              states: [
                {name: 'c'}
              ]
            }
          ]
        }
      ];
      const expected: StateDescriptor[] = [
        {
          name: 'a',
          rule: null,
          parent: null
        },
        {
          name: 'b',
          rule: {
            id: 1,
            parent: null,
            canEnter: {} as any
          },
          parent: null
        },
        {
          name: 'c',
          rule: {
            id: 2,
            parent: {
              id: 1,
              parent: null,
              canEnter: {} as any
            },
            canEnter: {} as any
          },
          parent: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
    it('Should have rules next to rules', () => {
      const config = [
        {name: 'a'},
        {
          canEnter: {} as any,
          states: [
            {name: 'b'},
            {
              canEnter: {} as any,
              states: [
                {name: 'c'}
              ]
            },
            {
              canEnter: {},
              states: [
                {name: 'd'}
              ]
            }
          ]
        }
      ];
      const expected: StateDescriptor[] = [
        {
          name: 'a',
          rule: null,
          parent: null
        },
        {
          name: 'b',
          rule: {
            id: 1,
            parent: null,
            canEnter: {} as any
          },
          parent: null
        },
        {
          name: 'c',
          rule: {
            id: 2,
            parent: {
              id: 1,
              parent: null,
              canEnter: {} as any
            },
            canEnter: {} as any
          },
          parent: null
        },
        {
          name: 'd',
          rule: {
            id: 3,
            parent: {
              id: 1,
              parent: null,
              canEnter: {} as any
            },
            canEnter: {} as any
          },
          parent: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
    it('Should have rules in multiple levels', () => {
      const config = [
        {name: 'a'},
        {
          canEnter: {} as any,
          states: [
            {name: 'b'},
            {
              canEnter: {} as any,
              states: [
                {name: 'c'},
                {
                  canEnter: {} as any,
                  states: [
                    {name: 'd'}
                  ]
                }
              ]
            }
          ]
        }
      ];
      const expected: StateDescriptor[] = [
        {
          name: 'a',
          rule: null,
          parent: null
        },
        {
          name: 'b',
          rule: {
            id: 1,
            parent: null,
            canEnter: {} as any
          },
          parent: null
        },
        {
          name: 'c',
          rule: {
            id: 2,
            parent: {
              id: 1,
              parent: null,
              canEnter: {} as any
            },
            canEnter: {} as any
          },
          parent: null
        },
        {
          name: 'd',
          rule: {
            id: 3,
            parent: {
              id: 2,
              parent: {
                id: 1,
                parent: null,
                canEnter: {} as any
              },
              canEnter: {} as any
            },
            canEnter: {} as any
          },
          parent: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
  });
  describe('with children', () => {
    it('should set parent for child', () => {
      const config = [
        {
          name: 'a',
          children: [{name: 'b'}]
        }];
      const expected = [
        {
          name: 'a',
          rule: null,
          parent: null
        },
        {
          name: 'b',
          parent: 'a',
          rule: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
    it('should set correct parent for child', () => {
      const config = [
        {
          name: 'a',
          children: [{name: 'c'}]
        },
        {
          name: 'b',
          children: [{name: 'd'}]
        }];
      const expected = [
        {
          name: 'a',
          rule: null,
          parent: null
        },
        {
          name: 'c',
          parent: 'a',
          rule: null
        },
        {
          name: 'b',
          rule: null,
          parent: null
        },
        {
          name: 'd',
          parent: 'b',
          rule: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
    it('should not set rules on children', () => {
      const config = [
        {
          canEnter: {} as any,
          states: [{
            name: 'a',
            children: [{name: 'b'}]
          }]
        }];
      const expected = [
        {
          name: 'a',
          rule: {
            id: 1,
            parent: null,
            canEnter: {} as any
          },
          parent: null
        },
        {
          name: 'b',
          parent: 'a',
          rule: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
    it('should concat child path with parents', () => {
      const parentPath = 'parent/';
      const childPath = 'child/';
      const config = [{
          name: 'a',
          path: parentPath,
          children: [
            {
              name: 'b',
              path: childPath
            }
          ]
        }];
      const expected: any = [
        {
          name: 'a',
          path: parentPath,
          parent: null,
          rule: null
        },
        {
          name: 'b',
          parent: 'a',
          path: parentPath + childPath,
          rule: null
        }
      ];
      expect(createStateDescriptors(config)).toEqual(expected);
    });
  });
});
