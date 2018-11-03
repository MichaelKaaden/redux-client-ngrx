import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { storeFreeze } from "ngrx-store-freeze";
import { environment } from "../../environments/environment";
import * as fromError from "./error.reducer";

export interface IAppState {
    errors: fromError.State;
}

export const reducers: ActionReducerMap<IAppState> = {
    errors: fromError.reducer,
};

/*
 * - storeFreeze prevents state from being mutated. When mutation occurs, an
 *   exception will be thrown. This is useful during development mode to
 *   ensure that none of the reducers accidentally mutates the state.
 */
export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [storeFreeze] : [];
