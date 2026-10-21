export type Gender = "Male" | "Female" | "Other";

export interface FamilyAndFriends {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relation: string;
  status: string;
  invite: boolean;
  inviteId: string;
}
export interface ProviderAndStaff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  status: string;
  invite: boolean;
  inviteId: string;
  providerType: string;
  department: string;
  location: string;
}
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
