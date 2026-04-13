import { JwtPayload } from 'jsonwebtoken';

export type JwtTokenPayload = JwtPayload &
  Partial<{
    username: string;
    sub: string;
  }>;
