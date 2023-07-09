export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  token?: string;
  admin: boolean;
  deleted: boolean;
}

export interface IJwtPayload {
  sub: string;
  email: string;
}
