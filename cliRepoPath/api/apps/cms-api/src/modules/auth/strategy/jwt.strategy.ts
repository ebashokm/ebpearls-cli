import { forwardRef, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../service/auth.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class JwtStrategy
 * @typedef {JwtStrategy}
 * @extends {PassportStrategy(Strategy, 'jwt')}
 */
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Creates an instance of JwtStrategy.
   *
   * @constructor
   * @param {ConfigService} configService
   */
  constructor(
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} payload
   * @returns {Promise<any>}
   */
  async validate(payload) {
    return await this.authService.validateAdminStatus(payload?.id);
  }
}
