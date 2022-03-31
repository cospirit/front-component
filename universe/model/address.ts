export interface Address {
  "@id"?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  city?: string;
  postalCode?: string;
  inseeCode?: string;
  country?: string;
  enabled?: boolean;
  longitude?: string;
  latitude?: string;
  email?: string;
  phoneNumber?: string;
  mobilePhoneNumber?: string;
  fax?: string;
  label?: string;
  createdBy?: string;
  updatedBy?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
