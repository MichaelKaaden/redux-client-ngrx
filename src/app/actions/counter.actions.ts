import { createAction, props } from "@ngrx/store";
import { Counter } from "../models/counter";

export const loadPending = createAction("[Counter] Load Pending", props<{ index: number }>());
export const loadCompleted = createAction("[Counter] Load Completed", props<{ index: number; counter: Counter }>());
export const loadAllPending = createAction("[Counter] Load All Pending");
export const loadAllCompleted = createAction("[Counter] Load All Completed", props<{ counters: Counter[] }>());
export const decrementPending = createAction("[Counter] Decrement Pending", props<{ index: number; by: number }>());
export const decrementCompleted = createAction("[Counter] Decrement Completed", props<{ index: number; counter: Counter }>());
export const incrementPending = createAction("[Counter] Increment Pending", props<{ index: number; by: number }>());
export const incrementCompleted = createAction("[Counter] Increment Completed", props<{ index: number; counter: Counter }>());
