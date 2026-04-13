import { Controller, HttpStatus, Res, Body, Post } from '@nestjs/common';
import { Response } from 'express';
import { CometChatService } from '../comet-chat.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CometChatController
 * @typedef {CometChatController}
 */
@Controller('/comet-chat')
export class CometChatController {
  /**
   * Creates an instance of CometChatController.
   *
   * @constructor
   * @param {CometChatService} cometChatService
   */
  constructor(private readonly cometChatService: CometChatService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {Body} body
   * @param {Response} res
   * @returns {Promise<void>}
   */
  @Post('')
  async handleCometChatWebhook(@Body() body: Body, @Res() res: Response) {
    try {
      console.log('comet chat webhook received');
      await this.cometChatService.handleCometChatWebhook(body);
      res.send({ status: HttpStatus.OK, res: 'Webhook delivered' });
    } catch (error) {
      res.send({ status: HttpStatus.OK, res: error.message });
    }
  }
}
