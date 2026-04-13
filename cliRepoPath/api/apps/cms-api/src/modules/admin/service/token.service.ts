import * as crypto from 'crypto';
import { forwardRef, Inject } from '@nestjs/common';
import { TokenRepository } from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TokenService
 * @typedef {TokenService}
 */
export class TokenService {
  /**
   * Creates an instance of TokenService.
   *
   * @constructor
   * @param {TokenRepository} tokenRepository
   */
  constructor(
    @Inject(forwardRef(() => TokenRepository))
    private readonly tokenRepository: TokenRepository,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} userId
   * @returns {Promise<any>}
   */
  async getToken(userId: string) {
    return await this.tokenRepository.findOne({
      userId,
      expiresIn: { $gt: Date.now() },
    });
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} userId
   * @returns {Promise<any>}
   */
  async generateToken(userId: string) {
    const token = await this.tokenRepository.create({
      userId,
      token: crypto.randomBytes(32).toString('hex'),
      expiresIn: Date.now() + 360000,
    });

    return token;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} userId
   * @param {string} token
   * @returns {Promise<any>}
   */
  async validate(userId: string, token: string) {
    const validToken = await this.tokenRepository.findOne({
      userId,
      token,
      expiresIn: { $gt: new Date() },
    });

    return validToken;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} token
   * @returns {Promise<any>}
   */
  async removeToken(token: string) {
    return await this.tokenRepository.deleteOne({ token });
  }
}
