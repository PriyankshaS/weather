import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
      ignoreExpiration: false,
      secretOrKey: 'mumzworld',
    });
  }

  // The payload contains the user ID
  async validate(payload: any) {
    return { user_id: payload.user_id }; // Attach user info to request
  }
}
