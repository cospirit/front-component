export default interface Service {
  "@id"?: string;
  code?: string;
  label?: string;
  createdBy?: string;
  updatedBy?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
