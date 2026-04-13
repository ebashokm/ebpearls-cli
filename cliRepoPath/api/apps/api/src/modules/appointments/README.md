# **Appointment Module**

The **Appointment Module** provides a complete and extensible system for managing appointments within the application. It supports **single and recurring appointments**, **rescheduling**, **cancellations**, and seamless integration with clients, practitioners, and locations—exposed through a clean **GraphQL API**. This module abstracts scheduling complexity and offers a centralized service layer for other modules to interact with appointment data reliably.

---

## **Table of Contents**

1. Introduction
2. Features
3. Module Structure
4. Schema Dependencies
5. How It Works
6. Setup and Integration
7. Usage Examples
8. Module Logic Breakdown
   - Resolver
   - Service
   - Provider
   - DTOs (Input & Response)
9. Best Practices

---

## **Introduction**

The **Appointment Module** is responsible for handling all appointment-related operations, including creation, updates, rescheduling, and cancellations. It is designed to be modular, scalable, and easy to integrate with other domains such as **clients**, **practitioners**, **availability**, and **locations**.

The module follows **NestJS best practices** and clean architecture principles, separating concerns across resolvers, services, and data transfer objects (DTOs).

---

## **Features**

1. **Appointment Creation**
   - Create single appointments.
   - Create recurring appointments with shared configuration.

2. **Rescheduling & Cancellation**
   - Reschedule existing appointments.
   - Cancel appointments with reason and notes.

3. **Participant Management**
   - Attach clients and practitioners to appointments.
   - Assign appointments to specific locations.

4. **Calendar & Scheduling Configuration**
   - Supports configurable calendar behavior and filters.
   - Respects timezone and availability constraints.

5. **Modular & Reusable**
   - Exposes a clean API for other modules.
   - Easily removable without affecting unrelated domains.

---

## **Module Structure**

appointments/
├── dto
│ ├── input
│ ├── response
│
├── resolver/
│ └── appointment.resolver.ts
│
├── service/
│ └── appointment.service.ts
│
├── providers.ts
├── README.md

---

## **Schema Dependencies**

The Appointment Module depends on several supporting schemas that collectively define how appointments behave, appear, and are scheduled. These schemas are managed in their respective modules but are consumed by the Appointment Module.

### **Appointment Setting Schema**

Defines global and contextual appointment configuration.

- Appointment calendar settings
- Cancellation rules and limits
- System-level appointment behavior

---

### **Appointment Category Schema**

Defines logical grouping for appointments.

- Category name and metadata
- Used for reporting, filtering, and classification

---

### **Appointment Type Schema**

Defines the core characteristics of an appointment.

- Appointment title
- Category association
- Description
- Duration
- Allows multiple practitioners per appointment

---

### **Calendar Filter Schema**

Controls how appointments are filtered and displayed in calendar views.

- Filter definitions
- User- or role-based calendar visibility rules

---

### **Location Schema**

Specifies where appointments take place.

- Physical or virtual locations
- Location-specific constraints and metadata

---

### **Timezone Schema**

Handles timezone configuration for appointments.

- Timezone definition
- Ensures correct time calculations across regions
- Supports users and locations in different timezones

---

### **Recurrence Pattern Schema**

Stores recurrence rules for recurring appointments.

- Frequency and interval
- Occurrence patterns
- Start and end conditions

---

### **Admin Block Schema**

Manages practitioner unavailability.

- Practitioner blocked time ranges
- Prevents bookings during unavailable periods
- Used in conflict and availability checks

---

## **How It Works**

1. **Client Requests**  
   GraphQL queries and mutations are sent from the client.

2. **Resolver Layer**  
   The resolver receives the request, validates arguments, and maps them to service calls.

3. **Service Layer**  
   Executes business logic such as conflict checks, recurrence handling, timezone normalization, and validation against dependent schemas.

4. **DTO Transformation**  
   Input DTOs validate incoming data. Response DTOs shape and sanitize outgoing data.

---

## **Setup and Integration**

### **Adding the Module**

@Module({
imports: [AppointmentModule],
})
export class AppModule {}

---

### **Removing the Module**

To completely remove the Appointment Module:

- Remove `import { AppointmentModule } from './modules/appointments/appointment.module';` from `app.module.ts`
- Remove `AppointmentModule` from the `imports` array
- Remove constructor injections related to appointments
- Remove appointment schema and repositories from `imports`, `exports`, and `providers` arrays in `data-access.module.ts`
- Remove appointment exports from `data-access/index.ts`
- Delete `/apps/api/src/modules/appointments`

---

## **Usage Examples**

Create an appointment:  
`await this.appointmentRepository.create(inputData, session);`

Create appointment instances:  
`await this.createAppointmentInstance(appointment, inputData, session);`

Update appointment instances:  
`await this.updateAppointmentInstance(appointment, inputData, session);`

Cancel an appointment booking:  
`await this.appointmentBookingsCancellationService(instanceId, cancelReason, cancelNote, option);`

---

## **Module Logic Breakdown**

### **Resolver**

Handles GraphQL requests from the client. Maps queries and mutations to service methods using decorators like `@Query()`, `@Mutation()`, and `@Args()`. Returns data according to the GraphQL schema and avoids business logic.

---

### **Service**

Implements core appointment business logic. Performs validation and conflict checks, applies recurrence rules, respects timezone and admin blocks, coordinates with related modules (clients, practitioners, availability, locations), manages rescheduling and cancellation workflows, and interacts with repositories or ORM layers.

---

### **Provider**

Registers `AppointmentResolver` as a GraphQL resolver and `AppointmentService` as a NestJS injectable service, enabling dependency injection throughout the module.

---

### **DTOs (Data Transfer Objects)**

**Input DTOs** validate and shape incoming GraphQL arguments, prevent over-posting, and provide strongly typed inputs.

**Response DTOs** shape returned data, hide internal or sensitive fields, ensure consistent API output, and provide strongly typed return values.

---

## **Best Practices**

- Keep resolvers thin and delegate logic to services.
- Always validate inputs using DTOs.
- Respect dependent schemas when performing scheduling logic.
- Design services to be reusable across modules.
- Follow the removal steps carefully to avoid orphaned dependencies.

---
