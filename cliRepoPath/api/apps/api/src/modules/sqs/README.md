## Description

SQS Module

The SQS Module provides AWS Simple Queue Service (SQS) integration for handling asynchronous message processing. It includes message sending, receiving, and handling capabilities with support for background job processing.

## Features

- **Message Sending**: Send messages to SQS queues using the GraphQL mutation
- **Message Listening**: Continuously listen and consume messages from SQS queues
- **Message Processing**: Handle different types of queue jobs with extensible handlers
- **Configuration**: Enable/disable SQS via environment variables
- **Error Handling**: Robust error handling with logging and retry mechanisms

## Installation

The SQS Module is included with the initial setup of Ebtheme. If you do not need this module, follow these steps.

#### Steps

- Remove `/apps/api/src/modules/sqs` folder

- Remove the following code from `apps/api/src/app.module.ts`
```bash
import { SQSModule } from './modules/sqs/sqs.module';

and SQSModule from import array

and SQSModule from include array of graphql
```
- Remove `libs/common/services/sqs` folder

## Configuration

The SQS Module requires the following environment variables:

- `SQS_QUEUE_URL`: The URL of your AWS SQS queue
- `ENABLE_SQS`: Set to "true" to enable SQS listener (default: "false")
- `SQS_AWS_REGION`: AWS region for SQS service
- `SQS_AWS_ACCESS_KEY_ID`: AWS access key ID for authentication
- `SQS_AWS_SECRET_ACCESS_KEY`: AWS secret access key for authentication

## Dead Letter Queue (DLQ)

The SQS Module is configured to work with Dead Letter Queues for handling failed messages:

### How It Works

1. **Message Processing**: Messages are consumed from the primary SQS queue with a visibility timeout of 30 seconds
2. **Failed Messages**: If message processing fails (error is thrown), the message is not deleted and becomes visible again
3. **Retry Mechanism**: After the visibility timeout, the message returns to the queue for retry attempts
4. **DLQ Transfer**: After a configured number of failed attempts (typically 3-5, configurable in AWS), the message is automatically sent to the Dead Letter Queue

### Setting Up DLQ in AWS

1. Create a Dead Letter Queue (DLQ) in your AWS SQS console
2. Configure your primary queue's redrive policy to point to the DLQ
3. Set the "Maximum Receives" threshold (number of failed attempts before moving to DLQ)

### Monitoring Failed Messages

Messages in the DLQ indicate processing failures and should be investigated:

- Check CloudWatch Logs for error messages from `SqsListenerService`
- Review the message content and error details
- Fix the underlying issue and replay the message if needed

### Configuration in AWS Console

```
Primary Queue → Redrive Policy
├── Dead Letter Queue: arn:aws:sqs:region:account:dlq-name
└── Maximum Receives: 3-5 (recommended)
```

### Handling DLQ Messages

You can manually process DLQ messages by:

1. Creating a separate consumer pointing to the DLQ URL
2. Investigating the failure cause
3. Either fixing the issue and reprocessing, or discarding the message

## Usage

### Sending Messages

Use the GraphQL mutation to test send messages to the SQS queue:

```graphql
mutation {
  sendToQueue(payload: {  
    "data": {
          "name":"Test"
        } 
    }
    )
}
```
For Testing Failed message:
```graphql
mutation {
  SendToQueueError(payload: {  
    "data": {
          "name":"Test fail"
        } 
    }
    )
}
```

### Processing Messages

Messages are automatically consumed and processed by the `SqsListenerService`. To handle specific job types, add cases in `SQSHandlerService.handleQueueJob()`:

```typescript
case SQSQueueJob.YOUR_JOB_TYPE:
  // Implement your job handling logic
  break;
```

### Adding New Job Types

1. Add the job type to `enum/sqs.enum.ts`:
```typescript
export enum SQSQueueJob {
  TEST_SQS_JOB = 'TEST_SQS_JOB',
  YOUR_JOB_TYPE = 'YOUR_JOB_TYPE',
}
```

2. Implement the handling logic in `SQSHandlerService`

3. Send messages with the corresponding job type

## Services

- **SQSResolver**: Provides GraphQL mutations for sending messages to SQS
- **SQSHandlerService**: Handles processing of different job types from the queue
- **SqsListenerService**: Listens to the SQS queue and processes incoming messages
- **SqsBaseService** (from @app/common): Provides low-level SQS client operations
