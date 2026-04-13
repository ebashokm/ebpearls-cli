import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { StartRecordingInput } from './dtos/input/start-recording.input';
import { UsersRepository } from '@app/data-access';
import { IAcquire } from '@app/common/services/cloud-recording/cloud-recording.interface';
import { CloudRecording } from '@app/common/services/cloud-recording/cloud-recording.service';
import { AgoraRecordingRepository } from '@app/data-access/agora/agora-recording.repository';
import { mongoIdToAgoraUid } from '@app/common/helpers/genericFunction';
import { Recording } from '@app/common/enum/recording.enum';

@Injectable()
export class CloudRecordingService {
  constructor(
    private readonly cloudRecording: CloudRecording,
    private readonly userRepository: UsersRepository,
    private readonly recordingRepository: AgoraRecordingRepository,
    private readonly i18nService: I18nService
  ) {}

  async start(input: StartRecordingInput, loginDetail) {
    const result = { success: true, message: null, data: null };
    const { channelName, token } = input;
    const { userId } = loginDetail;
    let recording = null;
    let acquireResource = null;
    let startRecording = null;
    let user = null;
    try {
      user = await this.userRepository.findOne({ _id: userId });

      if (!user) {
        result.message = this.i18nService.t('common.not_found', { args: { field: 'User' } });
        result.success = false;
        return result;
      }

      acquireResource = await this.cloudRecording.acquire({
        cname: channelName,
        uid: mongoIdToAgoraUid(userId),
        clientRequest: {},
      } as IAcquire);
    
      if (acquireResource.success) {
        startRecording = await this.cloudRecording.start(acquireResource.data, token);

        if (startRecording.success) {
          // Save recording document to database
          const recordingData = {
            userId: userId,
            resourceId: startRecording.data.resourceId,
            sid: startRecording.data.sid,
            uid: startRecording.data.uid,
            cname: startRecording.data.cname,
            status: Recording.recording,
          };

          recording = await this.recordingRepository.create(recordingData);
          result.data = recording;
        } else {
          result.success = false;
          result.message = this.i18nService.t('agora.failed_to_start_recording');
        }
      } else {
        result.success = false;
        result.message = this.i18nService.t('agora.failed_to_acquire_recording_resource');
      }

      result.message = this.i18nService.t('agora.recording_started');

    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

  async stop(input: StartRecordingInput, loginDetail) {
    const result = { success: true, message: null, data: null };
    const { channelName } = input;
    const { userId } = loginDetail;

    let stop = null;

    try {
      // Find the recording by sid from database
      const recordingData = await this.recordingRepository.findOne({userId,cname:channelName,status:Recording.recording}, null, { sort: { createdAt: -1 } });
      
      if (!recordingData) {
        result.message = this.i18nService.t('common.not_found', { args: { field: 'Recording' } });
        result.success = false;

        return result;
      }

     
      // Verify user owns this recording
      if (recordingData.userId.toString() !== userId.toString()) {
        result.message = this.i18nService.t('agora.unauthorized_recording');
        result.success = false;
        return result;
      }

      // Stop the recording with Agora
      if (recordingData.resourceId) {
        stop = await this.cloudRecording.stop({
          resourceId: recordingData.resourceId,
          cname: recordingData.cname,
          uid: recordingData.uid.toString(),
          sid: recordingData.sid,
        });


        const updateData: any = {
          status: Recording.stopped,
    
        };

        if (stop.success && stop?.data?.serverResponse?.fileList && stop?.data?.serverResponse?.fileList.length) {
          // Add file list to recording
          updateData.recordingFileList = stop?.data?.serverResponse?.fileList;
          updateData.status = Recording.completed;
        } else {
          updateData.errorMessage = stop?.data?.errorMessage || 'No files recorded';
          updateData.status = Recording.failed;
        }

        // Update recording in database
       await this.recordingRepository.updateOne({ sid: recordingData.sid }, updateData);
      }

      result.message = this.i18nService.t('agora.recording_stopped');
      result.data = recordingData;
    } catch (error) {
      result.success = false;
      result.message = error.message;
    }

    return result;
  }

}

