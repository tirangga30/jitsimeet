export interface MembersType {
  id: number;
  name: string;
  relation: string;
  mobile: string;
  email: string;
  checked: boolean;
  inviteTime?: string;
}

export interface MemberFormInputType {
  id: number;
  name: string;
  relation: string;
  mobile: number;
  email: string;
}
