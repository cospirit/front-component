import Entity from "./Entity";
import AttributeGroup from "./AttributeGroup";

export default interface Attribute {
  "@id": string;
  name: string;
  description: string;
  type: string;
  editableLevel: number;
  visibleLevel: number;
  enabled: boolean;
  rootOnly: boolean;
  choices?: any;
  attributeGroup?: AttributeGroup;
  owner?: Entity;
  readonly code: string;
  readonly technical?: boolean;
  readonly createdAt?: Date;
  readonly createdBy?: string;
  readonly updatedAt?: Date;
  readonly updatedBy?: string;
}
