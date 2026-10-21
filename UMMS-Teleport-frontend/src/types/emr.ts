export interface EmrImageRecord {
  id: string;
  patientId: string;
  imageUrl: string;
  fileName: string;
  sendToEMR: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpacesFile {
  key: string;
  name: string;
  url: string;
  uploadedAt: string;
  size: number;
  sendToEMR: boolean;
}

export interface EmrImagesResponse {
  success: boolean;
  data: {
    databaseRecords: EmrImageRecord[];
    spacesFiles: SpacesFile[];
  };
}

export interface UploadEmrInput {
  patientDbId: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  visitId: string;
  fileType?: string;
  imageBase64: string;
}
