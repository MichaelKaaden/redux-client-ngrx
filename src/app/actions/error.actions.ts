import { Action } from "@ngrx/store";

export enum ErrorActionTypes {
    ErrorOccurred = "[Error] Error Occurred",
    ResetErrors = "[Error] Reset Errors",
}

export class ErrorOccurred implements Action {
    readonly type = ErrorActionTypes.ErrorOccurred;
    constructor(readonly payload: { error: string }) {}
}

export class ResetErrors implements Action {
    readonly type = ErrorActionTypes.ResetErrors;
}

export type ErrorActions = ErrorOccurred | ResetErrors;
