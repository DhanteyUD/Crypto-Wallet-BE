export interface UserData {
  email: string;
}

export interface Payload {
  email: string;
  fullname: string;
  currentDate: Date;
}

export interface TokenPayload {
  email: string;
  phone: number;
  fullname: string;
  date: Date;
}