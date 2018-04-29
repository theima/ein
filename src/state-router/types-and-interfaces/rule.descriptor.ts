export interface RuleDescriptor {
  id: number;
  canEnter: any;
  parent: RuleDescriptor | null;
}
