export interface User {
  "@id"?: string;
  roleGroup?: any;
  readonly email?: string;
  readonly enabled?: boolean;
  readonly roles?: any;
  readonly person?: any;
  readonly createdAt?: Date;
  readonly createdBy?: string;
  readonly updatedAt?: Date;
  readonly updatedBy?: string;
}
