# **Fancy Email Template Module**

The **Fancy Email Template Module** provides a complete and extensible system for creating and managing rich email templates within the application. It supports **template creation, editing, duplication, activation/deactivation, and deletion**—exposed through a clean **GraphQL API**. This module abstracts template management complexity and offers a centralized service layer for other modules to interact with email template data reliably.

---

## **Table of Contents**

1. Introduction
2. Features
3. Module Structure
4. How It Works
5. Setup and Integration
6. Usage Examples
7. Module Logic Breakdown
   - Resolver
   - Service
   - DTOs (Input & Response)
8. Best Practices

---

## **Introduction**

The **Fancy Email Template Module** is responsible for handling all email template operations, including creation, updates, duplication, activation, deactivation, and deletion. It is designed to be modular, scalable, and easy to integrate with other domains such as **marketing**, **notifications**, and **email rendering services**.

The module follows **NestJS best practices** and clean architecture principles, separating concerns across resolvers, services, and data transfer objects (DTOs).

---

## **Features**

1. **Template Creation**
   - Create rich email templates with text, images, buttons, links, fonts, colors, sizes, and layout controls.
   - Save templates as draft or active.

2. **Template Editing & Management**
   - Update template content, styling, and metadata.
   - Activate or deactivate templates.
   - Duplicate templates for reuse.
   - Delete templates when no longer needed.

3. **Lifecycle & Rendering Control**
   - Manage draft, active, and inactive template states.
   - Ensure consistent rendering across email clients.

4. **Modular & Reusable**
   - Exposes a clean API for other modules.
   - Easily extendable to include new template components or styling options.

---

## **Module Structure**

fancy-email-template/
├── fancy-email-template.module.ts
├── fancy-email-template.service.ts
├── fancy-email-template.resolver.ts
├── dto
│ ├── input
│ ├── response

---

## **How It Works**

1. **Client Requests**  
   GraphQL queries and mutations are sent from the client.

2. **Resolver Layer**  
   The resolver receives requests, validates arguments, and maps them to service calls.

3. **Service Layer**  
   Executes business logic such as template creation, updates, duplication, activation/deactivation, and deletion.

4. **DTO Transformation**  
   Input DTOs validate incoming data. Response DTOs shape and sanitize outgoing data.

---

## **Setup and Integration**

### **Adding the Module**

@Module({
imports: [FancyEmailTemplateModule],
})
export class AppModule {}

---

### **Removing the Module**

To completely remove the Fancy Email Template Module:

- Remove `import { FancyEmailTemplateModule } from './modules/fancy-email-template/fancy-email-template.module';` from `app.module.ts`
- Remove `FancyEmailTemplateModule` from the `imports` array
- Remove constructor injections related to email templates
- Remove schema and repository from `imports`, `exports`, and `providers` arrays in `fancy-email-template.module.ts`
- Remove exports from `data-access/fancy-email-template/index.ts`
- Delete `/apps/cms-api/src/modules/fancy-email-template`

---

## **Usage Examples**

Create a new email template:  
`await this.emailBuilderRepository.create({ ...data, isDraft: false });`

Update template status:  
`await this.emailBuilderRepository.updateOne({ _id: input.templateId }, { status: input.status });`

List email templates:  
`await this.emailBuilderRepository.listEmailBuilderTemplates(input);`

---

## **Module Logic Breakdown**

### **Resolver**

Handles GraphQL requests from the client. Maps queries and mutations to service methods using decorators like `@Query()`, `@Mutation()`, and `@Args()`. Returns data according to the GraphQL schema and avoids business logic.

---

### **Service**

Implements core email template business logic. Performs validation, formatting, status management, duplication handling, coordinates with related modules (marketing, notifications), and interacts with repositories or ORM layers.

---

### **DTOs (Data Transfer Objects)**

**Input DTOs** validate and shape incoming GraphQL arguments, prevent over-posting, and provide strongly typed inputs.

**Response DTOs** shape returned data, hide internal or sensitive fields, ensure consistent API output, and provide strongly typed return values.

---

## **Best Practices**

- Keep resolvers thin and delegate logic to services.
- Always validate inputs using DTOs.
- Respect template lifecycle when performing operations.
- Design services to be reusable across modules.
- Follow the removal steps carefully to avoid orphaned dependencies.
