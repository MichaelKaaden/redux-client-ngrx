# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Branching model

This repo follows **Git Flow**: `master` holds released code (tagged per
version), `develop` is the integration branch. Releases are cut on `release/*`
branches, bumped (`[chore] Bump version for release x.y.z`), merged into
`master` and tagged, then merged back into `develop`. Feature work branches off
`develop`, not `master`.

## What this is

A single-page Angular + NgRx application that fetches "counters" from a REST
service, displays them, and lets the user increment/decrement each one. A second
page shows analytics (sum, average) over all counters. It's a reference/teaching
app for the Redux pattern (see README.md for the author's notes on
`@ngrx/entity` trade-offs) — one of several client implementations (ng-redux,
angular-redux, NgRx) against interchangeable backend implementations
(Rust/actix-web, Go/Gin, Node/Nest, Node/Express). There is no backend in this
repo; it expects a counter REST API at `environment.apiServer` (default
`http://localhost:3000`).

Angular 22, standalone bootstrap (no NgModules — see `src/main.ts`), Angular
Material, NgRx 21 (store, effects, entity, router-store, store-devtools).

## Commands

- `yarn start` / `ng serve` — dev server at `http://localhost:4200`
- `yarn build` / `ng build`
- `yarn test` / `ng test` — Karma/Jasmine unit tests, watches by default
    - Run a single spec: not supported via CLI filtering in this Karma setup;
      use Jasmine's `fdescribe`/`fit` in the spec file to focus, or narrow with
      `ng test --include='**/counter.reducer.spec.ts'`
- `yarn lint` / `ng lint` — ESLint (flat config in `eslint.config.mjs`)
- `yarn prettify` — Prettier over `src/**/*.{html,json,scss,md,js,ts}`

Husky runs `lint-staged` on pre-commit (Prettier + `eslint --fix` on staged
files per `.lintstagedrc`). Prettier: 4-space indent, 140 print width, always
trailing commas.

## Architecture

Standard NgRx flow, one feature slice per domain concept (`counters`, `errors`),
plus router-store. State shape is `IAppState` in `src/app/reducers/index.ts`.

- **actions/** — one file per domain, actions declared via `createActionGroup`
  (see `counter.actions.ts`). `actions/index.ts` re-exports everything;
  effects/components import from there, not from the individual files.
- **reducers/** — `createReducer` + `@ngrx/entity`'s `createEntityAdapter` for
  the `counters` slice. Because entity state only holds plain objects (not class
  instances — see README's `@ngrx/entity` section), `Counter` stays a plain
  interface, and reducers use `adapter.addOne/updateOne/addMany` rather than
  hand-rolled immutable updates.
- **effects/** — `counter.effects.ts` handles the load/increment/decrement
  pending→completed round trips against `CounterService`. Notable pattern:
  `loadPending$` reads current store state via
  `concatLatestFrom(() => this.store)` and returns a cached counter (skipping
  the HTTP call) if it's already loaded and not mid-load — deliberately uses
  `mergeMap`, not `switchMap`, so an in-flight request isn't cancelled by a
  later dispatch (see the comment in that effect). All effects funnel failures
  into `ErrorActions.errorOccurred`, never let them throw past the effect.
- **selectors/** — feature selectors composed with `createSelector`;
  derived/analytics values (`selectCounterSum`, `selectAverageSum`) are plain
  selectors over `selectCounters`, not stored state.
- **services/** — `CounterService` wraps the REST API; every response is
  unwrapped from an `IEnvelope { data, message, status }` shape.
- **components/** — one directory per component (`.ts`/`.html`/`.css`/
  `.spec.ts`), all standalone (`imports: [...]` on `@Component`, no NgModules),
  `ChangeDetectionStrategy.OnPush` throughout. `counter-container` is the smart
  component connecting to the store; `counter-heading` / `counter-input` /
  `counter-list` / `progress` / `error` are presentational.
- **main.ts** — bootstraps via `bootstrapApplication`; this is where store,
  effects, router, and HTTP client are wired up (`provideStore`, `provideState`,
  `provideEffects`, `provideStoreDevtools`, `provideHttpClient(withXhr())`).
  There's no `app.module.ts`.

Testing: reducers/selectors are tested with plain input/output assertions;
effects are tested with `jasmine-marbles` (`cold`/`hot` marble diagrams against
`Actions` streams). Follow the existing spec files' style when adding tests for
new actions/reducers/effects.

Component selector prefix is `mk` (enforced by
`@angular-eslint/component-selector` in `eslint.config.mjs`); directive
selectors are camelCase, also prefixed `mk`.
