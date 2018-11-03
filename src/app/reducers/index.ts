import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "../../environments/environment";

export interface IAppState {}

export const reducers: ActionReducerMap<IAppState> = {};

export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [] : [];
