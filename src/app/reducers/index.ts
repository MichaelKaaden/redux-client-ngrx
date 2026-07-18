import * as fromRouter from "@ngrx/router-store";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";

import * as fromCounter from "./counter.reducer";
import * as fromError from "./error.reducer";

export interface IAppState {
    counters: fromCounter.CountersState;
    errors: fromError.ErrorsState;
    router: fromRouter.RouterReducerState;
}

export const reducers: ActionReducerMap<IAppState> = {
    counters: fromCounter.reducer,
    errors: fromError.reducer,
    router: fromRouter.routerReducer,
};

// state mutation is already caught by the strictStateImmutability/strictActionImmutability
// runtime checks passed to provideStore() in main.ts, so no meta-reducers are needed here.
export const metaReducers: MetaReducer<IAppState>[] = [];
