import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromError from "../reducers/error.reducer";

export const selectErrorsState = createFeatureSelector<fromError.ErrorsState>("errors");
export const getErrors = createSelector(
    selectErrorsState,
    fromError.getErrors,
);
