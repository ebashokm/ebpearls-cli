# Cloud Recording Module

The Cloud Recording module provides functionality to record video calls and meetings using Agora Cloud Recording service. It enables users to start and stop recordings, manage recording data, and automatically store recordings in AWS S3.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Module Structure](#module-structure)
- [API Usage](#api-usage)
- [Services](#services)
- [Database Schema](#database-schema)
- [Security](#security)
- [Error Handling](#error-handling)
- [Internationalization](#internationalization)
- [Agora Configuration](#agora-configuration)
- [Troubleshooting](#troubleshooting)
- [Related Modules](#related-modules)

## Features

- **Start Recording**: Initiate cloud recording for video calls/meetings with automatic resource allocation
- **Stop Recording**: Terminate active recording sessions and retrieve recorded files
- **Recording Management**: Track recording status, metadata, and file information
- **AWS S3 Integration**: Automatically store recorded files in AWS S3 bucket
- **User Authorization**: Ensure only authenticated and authorized users can manage recordings
- **Recording History**: Maintain comprehensive recording data with timestamps and file details
- **Error Handling**: Robust error handling with detailed error messages and logging

## Installation

The Cloud Recording module comes with the initial setup of Ebtheme. If you do not need this module, follow these steps:

### Disable the Module

1. Remove `CloudRecordingModule` from your main application module:

```typescript
// apps/api/src/app.module.ts
// Remove or comment out the import
// import { CloudRecordingModule } from './modules/cloud-recording/cloud-recording.module';

// Remove from imports array in @Module decorator
@Module({
  imports: [
    // ... other imports
    // CloudRecordingModule, // Remove this line
  ],
})
export class AppModule {}
```

2. Remove cloud recording environment variables from your `.env` file:
   - `CLOUD_RECORDING_TOKEN`
   - `CLOUD_RECORDING_SECRET`
   - `CLOUD_RECORDING_HOST_NAME`


## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env

# Cloud Recording
CLOUD_RECORDING_TOKEN=your-agora-recording-token
CLOUD_RECORDING_SECRET=your-agora-recording-secret
CLOUD_RECORDING_HOST_NAME=api.agora.io


### Agora Setup

1. Create an Agora account at [agora.io](https://www.agora.io)
2. Create a new project and enable Cloud Recording service
3. Generate App ID and App Certificate
4. Enable token authentication
5. Configure your recording settings in the Agora Console

### AWS S3 Setup

1. Create an S3 bucket for storing recordings
2. Create an IAM user with S3 access permissions
3. Generate access keys for the IAM user
4. Ensure the bucket has proper CORS and access policies configured

## Module Structure


cloud-recording/
├── cloud-recording.module.ts      # Module definition
├── cloud-recording.resolver.ts    # GraphQL resolver
├── cloud-recording.service.ts     # Business logic
├── providers.ts                   # Module providers
├── dtos/
│   ├── input/
│   │   ├── start-recording.input.ts      # Start recording input DTO
│   │   ├── stop-recording.input.ts       # Stop recording input DTO
│   │   ├── list-recordings.input.ts      # List recordings input DTO
│   │   └── recording-setting.input.ts    # Recording settings input DTO
│   └── response/
│       ├── recording.response.ts         # Recording response DTO
│       └── list-recording.response.ts    # List recordings response DTO
└── README.md
```


## API Usage
```
### Start Recording

**GraphQL Mutation:**

```graphql
mutation StartRecord($input: StartRecordingInput!) {
  startRecord(input: $input) {
    message
    data {
      cname
      sid
      uid
      resourceId
      message
    }
  }
}
```

**Variables Example:**

```json
{
  "input": {
    "channelName": "my-meeting-channel",
    "callToken": "agora-rtc-token-here"
  }
}
```

**Response Example:**

```json
{
  "data": {
    "startRecord": {
      "message": "Recording started successfully",
      "data": {
        "cname": "my-meeting-channel",
        "sid": "session-id-123",
        "uid": 12345,
        "resourceId": "resource-id-123",
        "message": "Recording resource acquired"
      }
    }
  }
}
```

### Stop Recording

**GraphQL Mutation:**

```graphql
mutation StopRecord($input: StopRecordingInput!) {
  stopRecord(input: $input) {
    message
    data {
      cname
      sid
      uid
      recordingFileList {
        fileName
        fileSize
        fileUrl
        recordingStartTime
        recordingStopTime
      }
    }
  }
}
```

**Variables Example:**

```json
{
  "input": {
    "channelName": "my-meeting-channel"
  }
}
```

### List Recordings

**GraphQL Query:**

```graphql
query ListRecordings($input: ListRecordingsInput!) {
  listRecordings(input: $input) {
    data {
      id
      cname
      sid
      uid
      status
      recordingFileList
      createdAt
      updatedAt
    }
    pagination {
      total
      skip
      limit
    }
  }
}
```

## Services

### CloudRecordingService

Main service handling all recording operations.

#### Key Methods

**`start(input: StartRecordingInput, loginDetail: LoginDetailType): Promise<RecordingResponse>`**
- Initiates a new recording session
- Acquires recording resources from Agora
- Saves recording metadata to database
- Returns recording details with resource ID, SID, and UID
- Handles token generation and resource allocation

**`stop(input: StopRecordingInput, loginDetail: LoginDetailType): Promise<RecordingResponse>`**
- Stops an active recording session
- Validates user ownership of the recording
- Retrieves recorded files from Agora
- Uploads files to AWS S3
- Updates recording status in database
- Returns final recording data and file information

**`list(input: ListRecordingsInput, loginDetail: LoginDetailType): Promise<ListRecordingResponse>`**
- Retrieves paginated list of user's recordings
- Supports filtering by status and date range
- Includes file information and metadata

## Database Schema

Recording data is stored in MongoDB with the following structure:

```typescript
{
  _id: ObjectId;                    // Unique identifier
  userId: ObjectId;                 // Reference to User document
  cname: string;                    // Agora channel name
  sid: string;                      // Agora session ID
  uid: number;                      // Agora user ID
  resourceId: string;               // Agora resource ID
  status: 'recording' | 'stopped' | 'completed' | 'failed';
  recordingFileList: Array<{
    fileName: string;
    fileSize: number;
    fileUrl: string;                // S3 URL
    recordingStartTime: number;
    recordingStopTime: number;
  }>;
  errorMessage?: string;            // Error details if recording failed
  createdAt: Date;                  // Creation timestamp
  updatedAt: Date;                  // Last update timestamp
}
```

## Security

- **User Authorization**: All recording operations require user authentication via `@UseGuards(AuthUserGuard)`
- **Ownership Verification**: Users can only access/stop their own recordings
- **Token-based Access**: Agora tokens are required and validated for recording operations
- **Role-based Access Control**: Permissions are enforced at the service level
- **Data Encryption**: Sensitive credentials are encrypted and stored securely

## Error Handling

The module provides comprehensive error handling:

| Error | Status | Description |
|-------|--------|-------------|
| User Not Found | 404 | User doesn't exist in the system |
| Recording Not Found | 404 | Recording doesn't exist or was deleted |
| Unauthorized Access | 401 | User trying to access another user's recording |
| Resource Acquisition Failed | 500 | Agora resource allocation failed |
| Recording Failed | 500 | Recording process failed on Agora side |
| S3 Upload Error | 500 | Failed to upload file to S3 |
| Invalid Token | 401 | Recording token is invalid or expired |

## Internationalization

Error and success messages are internationalized. Message keys are located in:

```
apps/api/src/i18n/[language]/agora.json
```

Supported messages:
- `agora.recording_started` - Recording started successfully
- `agora.recording_stopped` - Recording stopped successfully
- `agora.failed_to_start_recording` - Failed to start recording
- `agora.failed_to_acquire_recording_resource` - Resource acquisition failed
- `agora.unauthorized_recording` - Unauthorized recording access
- `agora.recording_file_upload_failed` - File upload to S3 failed

## Agora Configuration

### Default Recording Settings

```typescript
{
  maxIdleTime: 30,                        // Max idle time in seconds
  streamTypes: 2,                         // Both audio and video
  audioProfile: 1,                        // High quality audio
  channelType: 0,                         // Communication mode
  videoStreamType: 0,                     // Default stream
  transcodingConfig: {
    height: 480,
    width: 854,
    bitrate: 500,
    fps: 15,
    mixedVideoLayout: 1,
    backgroundColor: '#000000'
  },
  recordingFileConfig: {
    avFileType: ['hls', 'mp4']            // Output formats
  },
  storageConfig: {
    vendor: 1,                            // AWS S3
    region: process.env.AWS_REGION ,    // Need AWS region code no  instead of string
    bucket: process.env.S3_BUCKET_NAME,
    accessKey: process.env.S3_ACCESS_KEY_ID,
    secretKey: process.env.S3_SECRET_ACCESS_KEY
  }
}
```

### AWS region codes:

```
  US_EAST_1 = 0,
  US_EAST_2 = 1,
  US_WEST_1 = 2,
  US_WEST_2 = 3,
  EU_WEST_1 = 4,
  EU_WEST_2 = 5,
  EU_WEST_3 = 6,
  EU_CENTRAL_1 = 7,
  AP_SOUTHEAST_1 = 8,
  AP_SOUTHEAST_2 = 9,
  AP_NORTHEAST_1 = 10,
  AP_NORTHEAST_2 = 11,
  SA_EAST_1 = 12,
  CA_CENTRAL_1 = 13,
  AP_SOUTH_1 = 14,
  CN_NORTH_1 = 15,
  CN_NORTHWEST_1 = 16,
  AF_SOUTH_1 = 18,
  AP_EAST_1 = 19,
  AP_NORTHEAST_3 = 20,
  EU_NORTH_1 = 21,
  ME_SOUTH_1 = 22,
  AP_SOUTHEAST_3 = 24,
  EU_SOUTH_1 = 25,
  ```

### Customization

To customize recording settings, modify the `getRecordingConfig()` method in `cloud-recording.service.ts`:

```typescript
private getRecordingConfig(): RecordingConfig {
  return {
    // Customize settings here
  };
}
```


## Troubleshooting

### Recording Won't Start

**Problem**: Recording fails to initiate
**Solutions**:
1. Verify Agora App ID and Certificate are correct
2. Check that the channel name is valid and not empty
3. Ensure user is authenticated and token is valid
4. Verify Agora Cloud Recording service is enabled
5. Check Agora service status at [status.agora.io](https://status.agora.io)

### Recording Files Not Found

**Problem**: Recorded files are not appearing in S3
**Solutions**:
1. Verify AWS S3 credentials in environment variables
2. Check S3 bucket name and region configuration
3. Ensure IAM user has S3 PutObject and GetObject permissions
4. Verify bucket CORS settings allow the required operations
5. Check CloudWatch logs for upload errors

### User Authorization Errors

**Problem**: "Unauthorized" errors when accessing recordings
**Solutions**:
1. Verify user ID in JWT token
2. Ensure user making the request owns the recording
3. Check that `AuthUserGuard` is properly applied
4. Verify user account is active and not disabled

### Performance Issues

**Problem**: Slow recording starts or stops
**Solutions**:
1. Check network connectivity to Agora servers
2. Verify AWS S3 upload bandwidth
3. Monitor database performance
4. Check server resource utilization
5. Review Agora rate limits

## Related Modules

- **[Auth Module](../auth/README.md)** - Provides user authentication and JWT tokens
- **[Users Module](../users/README.md)** - Manages user profiles and information
- **[Agora Module](../agora/README.md)** - Core Agora integration utilities
- **[AWS Module](../../libs/common/services/aws/README.md)** - AWS S3 and CloudFront services
- **[Data Access Module](../../libs/data-access/README.md)** - MongoDB repositories and schemas

## Support & Documentation

For additional help:

1. **Agora Cloud Recording Docs**: https://docs.agora.io/en/cloud-recording/
2. **AWS S3 Documentation**: https://docs.aws.amazon.com/s3/
3. **GraphQL Best Practices**: https://graphql.org/best-practices/
4. **NestJS Documentation**: https://docs.nestjs.com/

## License

This module is part of the EBTheme project and is licensed under the project's license.

## Contributing

When contributing to this module:

1. Follow the existing code structure and naming conventions
2. Write comprehensive tests for new features
3. Update this README with any changes
4. Ensure all error messages are internationalized
5. Follow the NestJS and GraphQL best practices

---

**Last Updated**: 2026
**Module Version**: 1.0.0
**Status**: Active