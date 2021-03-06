import * as fromRouter from "@ngrx/router-store";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";

import { environment } from "../../environments/environment";
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

/*
 * - storeFreeze prevents state from being mutated. When mutation occurs, an
 *   exception will be thrown. This is useful during development mode to
 *   ensure that none of the reducers accidentally mutates the state.
 */
export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [] : [];
