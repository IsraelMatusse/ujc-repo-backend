export interface FileCreateData {
  createdAt: Date;
  designation: string;
  path: string;
  type: string;
  updatedAt: Date;
}
export type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;
