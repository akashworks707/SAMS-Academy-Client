import { ComponentType } from "react";

export interface IRegister {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  salary?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IIngredient {
  name: string;
  price: number;
}

export type GetQueryParams = {
  searchTerm?: string;
  sort?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
};

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  paymentMethod?: string;
  status?: string;
}

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IPermission {
  _id: string;
  title: string;
  url: string;
  group: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  permissions?: IPermission[];
  address: string;
  status?: string;
  picture?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  salary?: number;
  commissionSalary?: number;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserApiResponse {
  data: IUser;
}
