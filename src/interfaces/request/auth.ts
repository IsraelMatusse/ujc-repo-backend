export interface AuthLoginData {
  email: string;
  password: string;
}

export interface DecodedTokenPayLoad {
  email: string;
  userId: string;
  iat: number;
  exp: number;
}

enum Headers {
  AUTHORIZATION = "authorization",
}
export { Headers };