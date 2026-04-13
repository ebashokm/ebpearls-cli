
# **Server-Sent Events (SSE) System**

This project includes two services, `EventsService` and `UserEventsService`, designed to implement **Server-Sent Events (SSE)** in a NestJS application. These services enable real-time communication between the server and clients, allowing for event broadcasting and user-specific event streams.

---

## **Table of Contents**

1. Introduction  
2. Features  
3. How It Works  
4. Setup and Usage  
   - EventsService  
   - UserEventsService  
5. API Endpoints  
6. Examples  
7. Best Practices  

---

## **Introduction**

**Server-Sent Events (SSE)** provide a lightweight and efficient mechanism for servers to push real-time updates to web clients.  
This implementation uses RxJS Subjects to manage event streams for broadcasting and user-specific notifications.  

### **Services Overview**  

- **`EventsService`:**  
  Handles global event broadcasting to all connected clients.  

- **`UserEventsService`:**  
  Supports user-specific event streams by creating a dedicated Subject for each user.  

---

## **Features**

1. **Global Event Broadcasting:**  
   Broadcast events to all connected clients using `EventsService`.  

2. **User-Specific Streams:**  
   - Create user-specific event streams with `UserEventsService`.  
   - Broadcast events to a specific user.  

3. **Dynamic Subscription Management:**  
   - Automatically manages multiple subscribers for both global and user-specific streams.  

4. **Real-Time Updates:**  
   - Enables real-time notifications for connected clients.  
   - Supports high scalability with RxJS.

5. **Performance Tracking:**  
   - Keeps track of active subscribers and unprocessed events.  

---

## **How It Works**

1. **RxJS Subjects for Event Streams:**  
   - A Subject is used as the core mechanism for publishing and subscribing to events.  
   - All emitted events are sent to active subscribers.  

2. **Global vs. User-Specific Streams:**  
   - The global stream (in `EventsService`) broadcasts events to all connected clients.  
   - User-specific streams (in `UserEventsService`) ensure targeted notifications.  

3. **Event Emission:**  
   - Events are emitted using the `next()` method of the Subject.  
   - Subscribers automatically receive these events.

4. **Subscription Management:**  
   - A map in `UserEventsService` maintains separate Subjects for individual users, enabling fine-grained control.

---

## **Setup and Usage**

### **1. EventsService**

#### **Purpose**  
Manages global event streams for all connected clients.  

#### **Methods**  
| Method           | Description                                                    |
|------------------|----------------------------------------------------------------|
| `sendEvent(data)` | Emits an event to all active subscribers. Logs if none exist. |

#### **Usage**  

1. **Inject the Service:**  
   `constructor(private readonly eventsService: EventsService) {}`

2. **Send a Global Event:**  
   `this.eventsService.sendEvent({ type: 'update', data: { key: 'value' } });`

3. **Subscribe to the Stream:**  
   In the controller, use `@Sse()` to expose an SSE endpoint:
   ```typescript
   @Sse('sse')
   sendEvents(): Observable<MessageEvent> {
       return this.eventsService.eventsSubject.asObservable().pipe(
           map(data => ({
               data: data,
               type: data.type,
           })),
       );
   }
   ```

### **2. UserEventsService**

#### **Purpose**  
Handles user-specific event streams, allowing the server to push notifications to individual users.

#### **Methods**

| Method                     | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| `createUserEventSubject(userId)` | Creates a Subject for the given user.                                 |
| `getUserEventSubject(userId)`    | Retrieves the existing Subject for the given user.                    |
| `sendEventToUser(userId, data)`  | Sends an event to the specified user if they have an active subscription. |

#### **Usage**

1. **Inject the Service:**  
   `constructor(private readonly userEventsService: UserEventsService) {}`

2. **Create a User-Specific Stream:**  
   `const userSubject = this.userEventsService.createUserEventSubject(userId);`

3. **Send an Event to a User:**  
   `this.userEventsService.sendEventToUser(userId, { type: 'notification', data: { message: 'Hello, User!' } });`

4. **Subscribe to the User Stream:**  
   ```typescript
   @Sse('sse/:userId')
   sendUserEvents(@Param('userId') userId: string): Observable<MessageEvent> {
       const userSubject = this.userEventsService.getUserEventSubject(userId);
       return userSubject.asObservable().pipe(
           map(data => ({
               data: data,
               type: data.type,
           })),
       );
   }
   ```

---

## **API Endpoints**

| Endpoint                          | Method | Description                                     |
|-----------------------------------|--------|-------------------------------------------------|
| `/events/sse`                     | SSE    | Streams global events to all clients.          |
| `/events/sse/:userId`             | SSE    | Streams user-specific events to a client.      |
| `/events/test-sse`                | GET    | Sends a test global event.                     |
| `/events/test-sse-delete-user`    | GET    | Sends a test user-specific event.              |
| `/events/test-sse-multiple`       | GET    | Sends multiple test user-specific events.      |

---

## **Examples**

### 1. Client-Side Setup for SSE
Use the JavaScript `EventSource` API to listen to events from the server:

```javascript
const eventSource = new EventSource('http://localhost:3001/events/sse');

eventSource.onmessage = (event) => {
  console.log('Received:', event.data);
};

eventSource.addEventListener('customEvent', (event) => {
  console.log('Custom Event:', event.data);
});

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
};
```

### 2. Listening to User-Specific Streams

Use the `EventSource` API to listen to events for a specific user:

```javascript
const eventSource = new EventSource('http://localhost:3001/events/sse/1');

eventSource.onmessage = (event) => {
  console.log('User-Specific Event:', event.data);
};
```

---

## **Best Practices**

### Error Handling
- Always implement error handling on both server and client sides for SSE to gracefully handle connection issues.

### Close Connections
- Ensure SSE connections are closed when no longer needed to avoid resource leaks.

### Batch Operations for Scalability
- When managing a large number of connections, use batching and introduce delays to prevent overloading the server.

### Authentication and Security
- Secure SSE endpoints to prevent unauthorized access and potential data leaks.

---

This documentation provides an overview of the system and its usage, ensuring developers can easily integrate and maintain the SSE functionality.

## **Uses Example: Sending Events on User Deletion**

This section demonstrates how to use the `EventsService` and `UserEventsService` to send events when a user is deleted. These events notify both global clients and the specific user.

---

### **Global Event - User Deleted**

The `EventsService` is used to send a global event that notifies all connected clients when a user is deleted. This is useful for broadcasting general updates about user status changes to all clients.

**Code Example:**

```typescript
this.eventsService.sendEvent({ type: 'user-deleted', data: { userId: String(id) } });
```

- **Explanation:**
  - `type: 'user-deleted'`: The event type is set to `user-deleted` to indicate that a user has been deleted.
  - `data: { userId: String(id) }`: The event data contains the `userId` of the deleted user, which is converted to a string.
  - **Usage**: This event is broadcast to all connected clients to inform them about the deletion of a user.

---

### **User-Specific Event - Delete User**

The `UserEventsService` is used to send a user-specific event. This is particularly useful for sending notifications or updates to the individual user whose account has been deleted.

**Code Example:**

```typescript
this.userEventsService.sendEventToUser(id.toString(), {
  type: 'delete-user',
  data: { userId: id.toString() },
});
```

- **Explanation:**
  - `id.toString()`: The user ID is converted to a string to ensure compatibility with the `sendEventToUser` method.
  - `type: 'delete-user'`: The event type is set to `delete-user` to signify that the user is being deleted.
  - `data: { userId: id.toString() }`: The event data contains the `userId` of the user being deleted, passed as part of the event payload.
  - **Usage**: This event is sent to a specific user, notifying them about the deletion of their account.

---

### **Summary**

- **Global Event (`user-deleted`)**: Notifies all clients about the deletion of a user.
- **User-Specific Event (`delete-user`)**: Notifies the specific user about the deletion of their account.

---

This example helps you implement event-based communication for user-related actions in a real-time environment using SSE.



# SSE Load Test Report (k6)

## Test Results Summary

| Test Scenario | Stages | Total Unique Listeners | Virtual Users (VUs) | SSE Event Sent | Successful Listeners |
|--------------|--------|----------------------|-------------------|---------------|---------------------|
| **Scenario 1: 5,000 Unique Listeners (1 VU per Listener)** | `{ duration: '1s', target: 1 }` | 5,000 | 5,000 | ✅ | 5,000 / 5,000 (100%) |
| **Scenario 2: 5,000 Unique Listeners (5 VUs per Listener)** | `{ duration: '1s', target: 5 }` | 5,000 | 25,000 | ✅ | 25,000 / 25,000 (100%) |
| **Scenario 3: 20,000 Unique Listeners (1 VU per Listener)** | `{ duration: '1s', target: 1 }` | 20,000 | 20,000 | ✅ | 20,000 / 20,000 (100%) |
| **Scenario 4: 20,000 Unique Listeners (5 VUs per Listener)** | `{ duration: '1s', target: 5 }` | 20,000 | 100,000 | ✅ | 100,000 / 100,000 (100%) |

---

## Summary
✅ All tests executed successfully.  
✅ SSE events were received by all listeners without failures.  
✅ Successfully scaled up to **100,000 concurrent SSE listeners**.  
✅ No performance bottlenecks detected.

---
