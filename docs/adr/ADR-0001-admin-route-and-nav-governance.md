# ADR-0001: Admin Route and Navigation Governance

## Status
Accepted

## Context
Admin surface has many planned modules, but not all are implemented.
Exposing unfinished routes as active navigation causes confusion and dead-link regressions.

## Decision
1. Sidebar is config-driven and implementation-aware.
2. Nav items for unimplemented areas remain `enabled: false`.
3. Only production-ready routes are enabled in sidebar.
4. Route and nav updates ship together to avoid mismatch.

## Consequences
- Cleaner admin UX with fewer broken paths.
- Clear roadmap visibility while protecting interaction quality.
- Lower maintenance overhead for feature-flag-like route states.
