export default interface Position {
  "@id"?: string;
  label?: string;
  level?: number;
  createdBy?: string;
  updatedBy?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
