# V2 User Management Design

## Goal

Build the usable `用户管理` module for V2 Standard so accounts can be maintained and bound to roles through mock and backend API modes.

## Scope

- User list with username, nickname, roles, status, last login time, created time, and actions.
- User create, edit, delete, enable/disable, and password reset.
- User role binding through a multi-select role field.
- Frontend API and mock API for user CRUD.
- Backend Node.js API with JSON persistence.
- Tests for user page rendering and backend user endpoints.

## Out Of Scope

- Department and post management.
- Avatar upload.
- Data permissions.
- Batch operations.
- Operation audit logs.

## Data Model

User records use:

- `id`: stable user id.
- `username`: login account.
- `nickname`: display name.
- `password`: stored only in backend/mock data.
- `roleIds`: selected role ids.
- `roleNames`: derived role names for list display.
- `status`: `1` enabled, `0` disabled.
- `lastLoginAt`: display timestamp.
- `createdAt`: display timestamp.
- `remark`: optional description.

## UX

The page follows the same standard table style as menu and role management. Role binding lives in the create/edit dialog. Password reset is a lightweight row action that resets to `123456` for the local JSON backend.

## Acceptance

- Admin can see user list and open create/edit dialogs.
- Admin can assign roles to users.
- Reset password, enable/disable, and delete actions call the proper APIs.
- Backend user list returns role names derived from `roles.json`.
- Updating a user's roles affects login permissions after re-login or user info refresh.
