import Attribute from "./Attribute";
import Entity from "./Entity";

export default interface AttributeValue {
  uuid: string;
  attribute: Attribute;
  entity: Entity;
  value: any;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
