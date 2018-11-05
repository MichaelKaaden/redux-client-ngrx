import { Action } from "@ngrx/store";
import { ICounter } from "../models/counter";

export enum CounterActionTypes {
    LoadPending = "[Counter] Load Pending",
    LoadCompleted = "[Counter] Load Completed",
    LoadAllPending = "[Counter] Load All Pending",
    LoadAllCompleted = "[Counter] Load All Completed",
    DecrementPending = "[Counter] Decrement Pending",
    DecrementCompleted = "[Counter] Decrement Completed",
    IncrementPending = "[Counter] Increment Pending",
    IncrementCompleted = "[Counter] Increment Completed",
}

export class LoadPending implements Action {
    readonly type = CounterActionTypes.LoadPending;

    constructor(readonly payload: { index: number }) {}
}

export class LoadCompleted implements Action {
    readonly type = CounterActionTypes.LoadCompleted;

    constructor(readonly payload: { index: number; counter: ICounter }) {}
}

export class LoadAllPending implements Action {
    readonly type = CounterActionTypes.LoadAllPending;
}

export class LoadAllCompleted implements Action {
    readonly type = CounterActionTypes.LoadAllCompleted;

    constructor(readonly payload: { counters: ICounter[] }) {}
}

export class DecrementPending implements Action {
    readonly type = CounterActionTypes.DecrementPending;

    constructor(readonly payload: { index: number; by: number }) {}
}

export class DecrementCompleted implements Action {
    readonly type = CounterActionTypes.DecrementCompleted;

    constructor(readonly payload: { index: number; counter: ICounter }) {}
}

export class IncrementPending implements Action {
    readonly type = CounterActionTypes.IncrementPending;

    constructor(readonly payload: { index: number; by: number }) {}
}

export class IncrementCompleted implements Action {
    readonly type = CounterActionTypes.IncrementCompleted;

    constructor(readonly payload: { index: number; counter: ICounter }) {}
}

export type CounterActions =
    | LoadPending
    | LoadCompleted
    | LoadAllPending
    | LoadAllCompleted
    | DecrementPending
    | DecrementCompleted
    | IncrementPending
    | IncrementCompleted;
