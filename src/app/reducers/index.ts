import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { storeFreeze } from "ngrx-store-freeze";
import { environment } from "../../environments/environment";
import * as fromCounter from "./counter.reducer";
import * as fromError from "./error.reducer";

export interface IAppState {
    counters: fromCounter.CountersState;
    errors: fromError.ErrorsState;
}

export const reducers: ActionReducerMap<IAppState> = {
    counters: fromCounter.reducer,
    errors: fromError.reducer,
};

/*
 * - storeFreeze prevents state from being mutated. When mutation occurs, an
 *   exception will be thrown. This is useful during development mode to
 *   ensure that none of the reducers accidentally mutates the state.
 */
export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [storeFreeze] : [];
