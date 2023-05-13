import { createReducer, on } from "@ngrx/store";
import { ErrorActions } from "../actions";

export interface ErrorsState {
    errors: string[];
}

export const initialState: ErrorsState = {
    errors: [],
};

export const reducer = createReducer(
    initialState,
    on(ErrorActions.errorOccurred, (state, action): ErrorsState => ({ errors: [...state.errors, action.error] })),
    on(ErrorActions.resetErrors, (): ErrorsState => initialState),
);

export const getErrors = (state: ErrorsState) => state.errors;
