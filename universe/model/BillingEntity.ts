export default interface BillingEntity {
  "@id"?: string;
  name?: string;
  businessName?: string;
  enabled?: boolean;
  address?: any;
  owner?: any;
  createdBy?: string;
  updatedBy?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
