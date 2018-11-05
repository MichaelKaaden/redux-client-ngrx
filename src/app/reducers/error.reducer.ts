import { ErrorActions, ErrorActionTypes } from "../actions/error.actions";

export interface State {
    errors: string[];
}

export const initialState: State = {
    errors: [],
};

export function reducer(state = initialState, action: ErrorActions): State {
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

export const getErrors = (state: State) => state.errors;
