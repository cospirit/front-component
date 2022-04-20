import AttributeValue from "./AttributeValue";

export default interface Entity {
  "uuid": string | null;
  name: string | null;
  enabled: boolean | null;
  parent: string | null;
  type: any | null;
  address: any | null;
  entityBillingEntities: any | null;
  areas: any | null;
  services: any | null;
  attributes: AttributeValue[];
  overloadedAttributes: any;
  readonly code: string | null;
  readonly level: number | null;
  readonly left: number | null;
  readonly right: number | null;
  readonly root: string | null;
  readonly createdAt: Date | null;
  readonly createdBy: string | null;
  readonly updatedAt: Date | null;
  readonly updatedBy: string | null;
}
