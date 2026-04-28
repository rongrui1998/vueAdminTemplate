# V2 Role Management Design

## Goal

Build the first usable `角色管理` module for V2 Standard so roles can be listed, maintained, and bound to menu/button permissions through both mock and backend API modes.

## Scope

- Role list with name, code, sort, status, permission count, user count, created time, and actions.
- Role create, edit, delete, and enable/disable.
- Role permission assignment through a menu tree with checkbox selection.
- Frontend API and mock API for role CRUD.
- Backend Node.js API with JSON persistence.
- Tests for the role page and backend role endpoints.

## Out Of Scope

- Data permission.
- Department permission.
- Role cloning.
- Batch delete.
- Operation audit logs.

## Data Model

Role records use:

- `id`: stable role id, used by user `roleIds`.
- `code`: role code shown in UI.
- `name`: role display name.
- `sort`: display order.
- `status`: `1` enabled, `0` disabled.
- `menuIds`: selected menu and button ids.
- `permissions`: derived permission codes from selected menu ids.
- `userCount`: computed from users.
- `createdAt`: display timestamp.
- `remark`: optional description.

## UX

The page follows the same standard table style as menu management. The permission tree opens in a dialog from each role row. The tree includes directory, menu, and button nodes, and role authorization is saved through a dedicated action instead of being mixed into the role edit form.

## Acceptance

- Admin can see role list and open create/edit/permission dialogs.
- Updating role menus changes stored `menuIds` and derived `permissions`.
- Backend role list returns `userCount`.
- Tests cover role page rendering, permission dialog opening, and backend role CRUD.
