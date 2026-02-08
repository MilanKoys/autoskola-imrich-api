import { Nullable } from "./nullable.js";

export interface Register {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthday: Date;
  courseType: string;
  courseCategory: string;
  courseStart: Nullable<Date>;
  preferedTime: Nullable<string>;
  remarks: Nullable<string>;
  agreement: boolean;
  tos: boolean;
}

export interface RegisterSchema {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthday: Date;
  courseType: string;
  courseCategory: string;
  courseStart: Nullable<Date>;
  preferedTime: Nullable<string>;
  remarks: Nullable<string>;
  agreement: boolean;
  tos: boolean;
}
