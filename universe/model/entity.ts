export interface Entity {
  "@id"?: string;
  name?: string;
  enabled?: boolean;
  parent?: string;
  type?: any;
  address?: any;
  entityBillingEntities?: any;
  areas?: any;
  services?: any;
  readonly code?: string;
  readonly level?: number;
  readonly left?: number;
  readonly right?: number;
  readonly root?: string;
  readonly createdAt?: Date;
  readonly createdBy?: string;
  readonly updatedAt?: Date;
  readonly updatedBy?: string;
}
