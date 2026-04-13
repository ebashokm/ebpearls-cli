import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StartRecordingInput } from './dtos/input/start-recording.input';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { CloudRecordingService } from './cloud-recording.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { RecordingResponse } from './dtos/response/recording.response';
import { LoginDetailType } from '../auth/types/login-detail.type';
@Resolver()
export class CloudRecordingResolver {
  constructor(private readonly cloudRecordingService: CloudRecordingService) {}

  @UseGuards(AuthUserGuard)
  @Mutation(() => RecordingResponse)
  async startRecord(@Args('input') input: StartRecordingInput, @LoginDetail() loginDetail: LoginDetailType) {
    const result = await this.cloudRecordingService.start(input, loginDetail);
    if (result.success) {
      return result;
    } else {
      throw new BadRequestException(result.message);
    }
  }


  @UseGuards(AuthUserGuard)
  @Mutation(() => RecordingResponse)
  async stopRecord(@Args('input') input: StartRecordingInput, @LoginDetail() loginDetail: LoginDetailType) {
    const result = await this.cloudRecordingService.stop(input, loginDetail);
    if (result.success) {
      return result;
    } else {
      throw new BadRequestException(result.message);
    }
  }

}
