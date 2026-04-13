# SurveyJS Page Management System

This project includes a comprehensive SurveyJS page management system built with NestJS and GraphQL. The system enables creation, management, and versioning of survey pages with support for SEO, dynamic content, and real-time status management.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Setup and Usage](#setup-and-usage)
- [API Operations](#api-operations)
- [Data Models](#data-models)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Introduction

The SurveyJS Page Management system provides a robust solution for managing survey pages in a CMS environment. It leverages GraphQL for flexible querying and NestJS for scalable backend architecture, enabling teams to create, manage, and publish survey content efficiently.

## Features

### Core Functionality

- **CRUD Operations**: Complete create, read, update, and delete operations for survey pages
- **Slug Management**: Automatic slug validation and uniqueness enforcement
- **Page Duplication**: Clone existing pages with automatic slug generation
- **Status Management**: Active/Inactive status with automatic publish date tracking
- **SEO Support**: Built-in SEO tags management for better search engine visibility

### Advanced Features

- **Survey JSON Storage**: Store complete SurveyJS configuration as JSON
- **Dynamic Elements**: Support for custom UI elements and configurations
- **Pagination**: Built-in pagination for listing pages efficiently
- **Search Functionality**: Search pages by title or slug
- **Permission-Based Access**: Role-based access control for all operations

## Setup and Usage

### 1. Module Configuration

The SurveyJS Page module is configured with necessary dependencies:

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SurveyJsPage.name, schema: SurveyJsPageSchema },
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  providers: [
    SurveyJsPageResolver,
    SurveyJsPageService,
    SurveyJsPageRepository,
    UsersRepository,
    AdminRepository,
    S3Service,
  ],
})
export class SurveyJsPageModule {}
```

### 2. Permissions

All operations require specific permissions:

- `create-page`: Create new survey pages
- `update-page`: Update existing pages
- `list-page`: List and search pages
- `get-page`: View individual page details
- `delete-page`: Soft delete pages
- `duplicate-page`: Duplicate existing pages

### 3. Status Management

Pages have two status states:

- **ACTIVE**: Published and visible, sets `publishedAt` timestamp
- **INACTIVE**: Draft or unpublished, clears `publishedAt` timestamp

When a page is set to ACTIVE, all other pages with the same title are automatically set to INACTIVE.

## API Operations

### Mutations

#### Create SurveyJS Page

Creates a new survey page with validation and automatic status management.

#### Update SurveyJS Page

Updates an existing page with automatic publishedAt management.

#### Duplicate SurveyJS Page

Creates a copy of an existing page with a unique slug.

**Duplication Logic:**

- Automatically appends "(Copy)" to title
- Generates unique slug with "-copy" suffix
- Sets status to INACTIVE
- Clears publishedAt date
- Marks as duplicated with `isDuplicated: true`

#### Delete SurveyJS Page

Deletes a page (sets `isDeleted: true` and `deletedAt` timestamp).

### Queries

#### List All SurveyJS Pages

Retrieves paginated list of survey pages with optional search.

**Search Capability:**

- Searches in both `title` and `slug` fields
- Case-insensitive regex matching
- Supports partial matches

#### Get Single SurveyJS Page

Retrieves complete details of a specific page.

#### Check Slug Existence

Validates if a slug is already in use.

**Returns:** `true` if slug exists, `false` otherwise

## Data Models

### SurveyJsPage Schema

```typescript
{
  title: string; // Page title (required)
  slug: string; // Unique URL-friendly identifier (required, unique)
  content: string; // Page description or content
  status: SurveyJsPageStatus; // ACTIVE or INACTIVE
  seoTags: SeoTag; // SEO metadata
  surveyJson: string; // Complete SurveyJS configuration as JSON string
  elements: object; // Custom UI elements and settings
  version: string; // Version tracking
  publishedAt: Date; // Timestamp when page was published
  isDuplicated: boolean; // Indicates if page is a duplicate
  isDeleted: boolean; // Soft delete flag
  deletedAt: Date; // Soft delete timestamp
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### SEO Tags Structure

```typescript
{
  title: string;        // SEO page title
  description: string;  // Meta description
  keywords: string[];   // SEO keywords array
}
```

## Best Practices

### Slug Management

- Use URL-friendly slugs (lowercase, hyphens, no special characters)
- Always check slug existence before creation
- Let the system handle slug generation for duplicates

### Status and Publishing

- Set pages to INACTIVE during editing and testing
- Only set to ACTIVE when ready for public access
- Remember: Activating a page deactivates others with the same title

### Content Management

- Store complete SurveyJS configuration in `surveyJson` field
- Use `elements` for additional UI settings and themes
- Keep `content` field for human-readable descriptions

### Performance

- Use pagination for large datasets (default limit: 5)
- Leverage search functionality instead of loading all pages
- Index frequently queried fields (slug, status, title)

### Error Handling

- Handle duplicate slug errors gracefully
- Validate input before submission
- Implement proper error messages for users

### Security

- Always use permission decorators on resolver methods
- Validate user permissions before operations
- Sanitize inputs to prevent injection attacks

### Version Control

- Use the `version` field to track major changes
- Consider creating duplicates for major revisions
- Maintain audit trails through `createdAt` and `updatedAt`

---

This documentation provides a complete overview of the SurveyJS Page Management system. For additional support or feature requests, please contact the development team.
