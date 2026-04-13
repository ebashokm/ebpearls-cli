import { forwardRef, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class LocalStrategy
 * @typedef {LocalStrategy}
 * @extends {PassportStrategy(Strategy)}
 */
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of LocalStrategy.
   *
   * @constructor
   * @param {AuthService} authService
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super({ usernameField: 'email' });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   */
  async validate(email: string, password: string) {
    return await this.authService.validate(email, password);
  }
}
