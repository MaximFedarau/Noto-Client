import { AxiosError } from 'axios';

export interface AuthData {
  nickname: string;
  password: string;
}

export interface SignUpData extends AuthData {
  confirmPassword: string;
}

export interface User {
  nickname: string;
  isAuth: boolean;
  avatar?: string;
}

export type Profile = Omit<User, 'isAuth'>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type AxiosMessageError = AxiosError<{ message: string }>;
