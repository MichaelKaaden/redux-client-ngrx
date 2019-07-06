import { Action, createReducer, on } from "@ngrx/store";
import * as errorActions from "../actions/error.actions";

export interface ErrorsState {
    errors: string[];
}

export const initialState: ErrorsState = {
    errors: [],
};

const errorReducer = createReducer(
    initialState,
    on(errorActions.errorOccurred, (state, action) => ({ errors: [...state.errors, action.error] })),
    on(errorActions.resetErrors, () => initialState),
);

export function reducer(state: ErrorsState = initialState, action: Action): ErrorsState {
    return errorReducer(state, action);
}

export const getErrors = (state: ErrorsState) => state.errors;
