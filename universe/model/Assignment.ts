export default interface Assignment {
  "@id"?: string;
  entity?: any;
  person?: any;
  position?: any;
  readonly createdAt?: Date;
  readonly createdBy?: string;
  readonly updatedAt?: Date;
  readonly updatedBy?: string;
}
