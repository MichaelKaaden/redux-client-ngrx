import { ErrorActions, ErrorActionTypes } from "../actions/error.actions";

export interface ErrorsState {
    errors: string[];
}

export const initialState: ErrorsState = {
    errors: [],
};

export function reducer(state: ErrorsState = initialState, action: ErrorActions): ErrorsState {
    switch (action.type) {
        case ErrorActionTypes.ErrorOccurred:
            return {
                errors: [...state.errors, action.payload.error],
            };

        case ErrorActionTypes.ResetErrors:
            return initialState;

        default:
            return state;
    }
}

export const getErrors = (state: ErrorsState) => state.errors;
