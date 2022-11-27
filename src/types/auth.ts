export interface SignInData {
  nickname: string;
  password: string;
}

export interface SignUpData {
  nickname: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  nickname: string;
  isAuth: boolean;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
