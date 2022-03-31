export interface Person {
  "@id"?: string;
  firstName?: string;
  lastName?: string;
  civility?: string;
  email?: string;
  phoneNumber?: string;
  enabled?: boolean;
  customCode?: string;
  address?: any;
  assignments?: any;
  readonly code?: string;
  readonly createdAt?: Date;
  readonly createdBy?: string;
  readonly updatedAt?: Date;
  readonly updatedBy?: string;
}
