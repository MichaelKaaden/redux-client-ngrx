import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromError from "../reducers/error.reducer";

export const selectErrorsState = createFeatureSelector<fromError.ErrorsState>("errors");
export const selectErrors = createSelector(selectErrorsState, fromError.getErrors);
