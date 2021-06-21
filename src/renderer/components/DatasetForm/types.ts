export interface DatasetFormData {
  file: File;
  isGrouped: boolean;
  groupIdField: number;
  textField: number;
}

export interface DatasetFormProps {
  initialValues: Partial<DatasetFormData>;
}
