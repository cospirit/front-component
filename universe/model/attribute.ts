export interface Attribute {
  "@id"?: string;
  name?: string;
  description?: string;
  type?: string;
  editableLevel?: number;
  visibleLevel?: number;
  enabled?: boolean;
  rootOnly?: boolean;
  choices?: any;
  attributeGroup?: any;
  owner?: any;
  readonly code?: string;
  readonly technical?: boolean;
  readonly createdAt?: Date;
  readonly createdBy?: string;
  readonly updatedAt?: Date;
  readonly updatedBy?: string;
}
