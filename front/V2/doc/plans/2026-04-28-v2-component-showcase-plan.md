# V2 Component Showcase Implementation Plan

**Goal:** Add standalone demo pages for `SearchForm`, `ProTable`, `ModalForm`, and `DrawerForm` so developers can choose either native Element Plus usage or template-provided wrappers.

**Architecture:** Keep the wrappers optional and documented as productivity helpers. Add a `DrawerForm` wrapper beside the existing component wrappers, then expose all four demos under the business demo menu.

**Verification:** Add component tests for `DrawerForm`, extend mock menu contract tests for the new demo entry, then run V2 unit tests, lint, stylelint, and build.

---

## Tasks

1. Add `DrawerForm` with a focused unit test.
2. Add four component showcase pages under `src/views/demo/components`.
3. Add the component showcase directory and child pages to mock menu data.
4. Document optional usage of wrapper components in the V2 roadmap.
5. Run test, lint, stylelint, and build.
