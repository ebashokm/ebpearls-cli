import { Inject, forwardRef, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

/**
 * ${1:Description placeholder}
 *
 * @type {10}
 */
export const SALT_ROUNDS = 10;

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class HashService
 * @typedef {HashService}
 */
@Injectable()
export class HashService {
  /**
   * Creates an instance of HashService.
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
   * @param {string} password
   * @returns {Promise<any>}
   */
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));

    return await bcrypt.hash(password, salt);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} password
   * @returns {Promise<any>}
   */
  async apphashPassword(password: string) {
    return await bcrypt.hash(password, Number(SALT_ROUNDS));
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} candidatePassword
   * @param {string} hash
   * @returns {Promise<any>}
   */
  async comparePassword(candidatePassword: string, hash: string) {
    return await bcrypt.compare(candidatePassword, hash);
  }
}
