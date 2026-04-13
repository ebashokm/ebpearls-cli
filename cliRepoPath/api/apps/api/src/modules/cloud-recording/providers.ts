
import { CloudRecording } from '@app/common/services/cloud-recording/cloud-recording.service';
import { CloudRecordingResolver } from './cloud-recording.resolver';
import { CloudRecordingService } from './cloud-recording.service';
import { UsersRepository } from '@app/data-access';
import { AgoraRecordingRepository } from '@app/data-access/agora/agora-recording.repository';

export const providers = [CloudRecording, CloudRecordingResolver, CloudRecordingService,UsersRepository,AgoraRecordingRepository];

