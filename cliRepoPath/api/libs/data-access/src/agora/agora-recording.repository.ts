import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { AgoraRecording, AgoraRecordingDocument } from './agora-recording.schema';


@Injectable()
export class AgoraRecordingRepository extends BaseRepo<AgoraRecordingDocument> {
  constructor(
    @InjectModel(AgoraRecording.name)
    private readonly agoraRecording: Model<AgoraRecordingDocument>,
  ) {
    super(agoraRecording);
  }
}
