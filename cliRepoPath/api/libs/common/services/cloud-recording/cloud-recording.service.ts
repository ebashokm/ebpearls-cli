import fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';
import { IAcquire } from './cloud-recording.interface';
import { CloudRecordingEndpoints } from './cloud-recording-endpoint';
import { HTTP_METHODS } from '@app/common/constant';
import { AwsRegion } from '@app/common/enum/aws-region.enum';

@Injectable()
export class CloudRecording {
  private customerToken = process.env.CLOUD_RECORDING_TOKEN;
  private customerSecret = process.env.CLOUD_RECORDING_SECRET;
  private awsRegion = 9; // Default to AP_SOUTHEAST_2
  private s3BucketName = process.env.S3_BUCKET_NAME;
  private s3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
  private s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  private options: any;
  private baseUrl = null;

  constructor() {

    const region = process.env.AWS_REGION;
    if (region && AwsRegion[region.toUpperCase()] !== undefined) {
      this.awsRegion = AwsRegion[region.toUpperCase()];
    } 
  }

  async acquire(body: IAcquire) {
    return await this.sendRequest(CloudRecordingEndpoints.ACQUIRE, HTTP_METHODS.POST, body);
  }

  async query(resource: any) {
    return await this.sendRequest(CloudRecordingEndpoints.QUERY(resource.resourceId, resource.sid));
  }

  async start(acquireResponse: any, token: string) {
    return await this.sendRequest(CloudRecordingEndpoints.START(acquireResponse.resourceId), HTTP_METHODS.POST, {
      cname: acquireResponse.cname,
      uid: acquireResponse.uid,
      clientRequest: {
        token: token,
        recordingConfig: {
          maxIdleTime: 30,
          streamTypes: 2,
          audioProfile: 1,
          channelType: 0,
          videoStreamType: 0,
          transcodingConfig: {
            height: 480,
            width: 854,
            bitrate: 500,
            fps: 15,
            mixedVideoLayout: 1,
            backgroundColor: '#FF0000',
          },
        },
        recordingFileConfig: {
          avFileType: ['hls', 'mp4'],
        },
        storageConfig: {
          vendor: 1, // AWS
          region: this.awsRegion, 
          bucket: this.s3BucketName,
          accessKey: this.s3AccessKeyId,
          secretKey: this.s3SecretAccessKey,
          fileNamePrefix: ['therapistRecording', acquireResponse.uid],
        },
      },
    });
  }

  async stop(resource: any) {
    return await this.sendRequest(CloudRecordingEndpoints.STOP(resource.resourceId, resource.sid), HTTP_METHODS.POST, {
      cname: resource.cname,
      uid: resource.uid,
      clientRequest: {},
    });
  }

  async sendRequest(endpoint: string, method: string = null, body: any = null) {
    const result = { success: true, message: null, data: null };
    this.options = {};
    this.options.method = HTTP_METHODS.GET;
    this.options.headers = {
      'Content-Type': 'application/json',
    };
    this.options.body = null;
    this.baseUrl = `https://${process.env.CLOUD_RECORDING_HOST_NAME}/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording`;

    try {
      const basicToken = Buffer.from(`${this.customerToken}:${this.customerSecret}`).toString('base64');
      this.options.headers.Authorization = `Basic ${basicToken}`;

      if (body) {
        this.options.body = JSON.stringify(body);
      }

      if (method) {
        this.options.method = method;
      }

      const callUrl = `${this.baseUrl}${endpoint}`;
      const response = await fetch(callUrl, this.options);
      const responseBody = await response.json();
      const data = { responseBody: responseBody, status: response.status };

      if (Object.keys(data.responseBody)) {
        result.success = true;
        result.data = data.responseBody;
      } else {
        result.message = data.responseBody?.error_description;
        result.success = false;
      }
    } catch (error) {
      result.message = error.message;
      result.success = false;
    }
    return result;
  }
}
