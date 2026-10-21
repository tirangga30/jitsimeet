export type Gender = "Male" | "Female" | "Other";

export interface ProviderAndStaff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department?: string | null;
  providerType?: string | null;
  location?: string | null;
  status: string;
}

export type CreateProviderInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department?: string;
  providerType?: string;
  location?: string;
  status: string;
  invite?: boolean;
  inviteId?: string;
};

export type UpdateProviderInput = Partial<CreateProviderInput>;

export interface FamilyAndFriends {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relation: string;
  status: string;
}

export type CreateFamilyAndFriendsInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relation: string;
  status: string;
  invite?: boolean;
  inviteId?: string;
};

export type UpdateFamilyAndFriendsInput = Partial<CreateFamilyAndFriendsInput>;

export interface Patient {
  id: string;

  firstName: string;
  lastName: string;

  gender: Gender;
  age: number;
  dob: string;

  medicareNumber: string;
  MRN: string;
  CBEN: string;
  phone: string;

  currentStatus: string;
  deviceAssociated: string;

  imageUrl?: string | null;

  createdAt: string;

  providers: ProviderAndStaff[];

  families: FamilyAndFriends[];
}

export interface PatientDetail extends Patient {
  providers: ProviderAndStaff[];
  families: FamilyAndFriends[];
  latestMeeting: Meeting | null;
  meetingCount: number;
}
export type CreatePatientInput = {
  firstName: string;
  lastName: string;

  gender: Gender;

  age: number;

  dob: string;

  medicareNumber: string;

  MRN: string;

  CBEN: string;

  phone: string;

  currentStatus: string;

  deviceAssociated: string;

  imageUrl?: string;

  providerIds: string[];

  familyIds: string[];
};

export type UpdatePatientInput = Partial<CreatePatientInput>;

export interface Meeting {
  id: string;

  roomId: string;

  patientId: string;

  createdAt: string;
}

export interface MeetingPage {
  items: Meeting[];
  nextCursor: string | null;
  hasMore: boolean;
}
