import { createAction, props } from "@ngrx/store";

export const errorOccurred = createAction("[Error] Error Occurred", props<{ error: string }>());
export const resetErrors = createAction("[Error] Reset Errors");
