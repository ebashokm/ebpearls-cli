import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class JwtService
 * @typedef {JwtService}
 */
@Injectable()
export class JwtService {
  /**
   * Creates an instance of JwtService.
   *
   * @constructor
   * @param {ConfigService} configService
   */
  constructor(
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} payload
   * @returns {Promise<any>}
   */
  async signAccessToken(payload) {
    return jwt.sign(payload, this.configService.get('ACCESS_TOKEN_SECRET'), {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} token
   * @returns {Promise<any>}
   */
  async verifyAccessToken(token) {
    return jwt.verify(token, this.configService.get('ACCESS_TOKEN_SECRET'));
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} payload
   * @returns {Promise<any>}
   */
  async signRefreshToken(payload) {
    return jwt.sign(payload, this.configService.get('REFRESH_TOKEN_SECRET'), {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} token
   * @returns {Promise<any>}
   */
  async verifyRefreshToken(token) {
    return jwt.verify(token, this.configService.get('REFRESH_TOKEN_SECRET'));
  }
}
