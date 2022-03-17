import { createReducer, on } from "@ngrx/store";
import * as errorActions from "../actions/error.actions";

export interface ErrorsState {
    errors: string[];
}

export const initialState: ErrorsState = {
    errors: [],
};

export const reducer = createReducer(
    initialState,
    on(errorActions.errorOccurred, (state, action): ErrorsState => ({ errors: [...state.errors, action.error] })),
    on(errorActions.resetErrors, (): ErrorsState => initialState),
);

export const getErrors = (state: ErrorsState) => state.errors;
